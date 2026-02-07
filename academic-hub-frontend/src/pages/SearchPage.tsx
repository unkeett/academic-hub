import React, { useState, useEffect, ElementType } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { FaFilter } from 'react-icons/fa';
import './SearchPage.css';

interface SearchFilters {
    type: string[];
    priority: string;
    date: string;
}

interface SearchResultItem {
    _id: string;
    type: 'subject' | 'goal' | 'tutorial' | 'idea';
    name?: string;
    title?: string;
    text?: string;
    description?: string;
    priority?: string;
    createdAt: string;
    updatedAt?: string;
}

const FilterIcon = FaFilter as ElementType;

const SearchPage: React.FC = () => {
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
        type: [],
        priority: '',
        date: 'newest'
    });

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';

    useEffect(() => {
        if (query) {
            performSearch();
        }
    }, [query, filters]);

    const performSearch = async () => {
        try {
            setLoading(true);
            const typeParam = filters.type.length > 0 ? filters.type.join(',') : '';

            let endpoint = `/api/search?q=${query}`;
            if (typeParam) endpoint += `&type=${typeParam}`;
            if (filters.priority) endpoint += `&priority=${filters.priority}`;
            if (filters.date) endpoint += `&sort=${filters.date}`;

            const res = await api.get(endpoint);
            setResults(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Search error:', error);
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType: keyof SearchFilters, value: string) => {
        setFilters(prev => {
            if (filterType === 'type') {
                const newTypes = prev.type.includes(value)
                    ? prev.type.filter(t => t !== value)
                    : [...prev.type, value];
                return { ...prev, type: newTypes };
            }
            return { ...prev, [filterType]: value };
        });
    };

    const renderResultItem = (item: SearchResultItem) => {
        let link = '#';
        let badgeClass = '';

        switch (item.type) {
            case 'subject':
                link = '/subjects';
                badgeClass = 'badge-subject';
                break;
            case 'goal':
                link = '/goals';
                badgeClass = 'badge-goal';
                break;
            case 'tutorial':
                link = '/tutorials';
                badgeClass = 'badge-tutorial';
                break;
            case 'idea':
                link = '/ideas';
                badgeClass = 'badge-idea';
                break;
            default:
                break;
        }

        return (
            <div key={item._id} className="search-result-card" onClick={() => navigate(link)}>
                <div className="result-header">
                    <span className={`result-type ${badgeClass}`}>{item.type.toUpperCase()}</span>
                    <span className="result-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="result-title">{item.name || item.title || item.text}</h3>
                {item.description && <p className="result-desc">{item.description.substring(0, 150)}...</p>}
                {item.type === 'goal' && item.priority && (
                    <span className={`priority-badge priority-${item.priority}`}>
                        {item.priority} Priority
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="search-page-container">
            <div className="search-header">
                <h2>Search Results</h2>
                <p>Showing results for "{query}"</p>
            </div>

            <div className="search-layout">
                <aside className="search-filters">
                    <div className="filter-group">
                        <h3><FilterIcon /> Filters</h3>

                        <div className="filter-section">
                            <h4>Type</h4>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={filters.type.includes('subject')}
                                    onChange={() => handleFilterChange('type', 'subject')}
                                /> Subjects
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={filters.type.includes('goal')}
                                    onChange={() => handleFilterChange('type', 'goal')}
                                /> Goals
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={filters.type.includes('tutorial')}
                                    onChange={() => handleFilterChange('type', 'tutorial')}
                                /> Tutorials
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={filters.type.includes('idea')}
                                    onChange={() => handleFilterChange('type', 'idea')}
                                /> Ideas
                            </label>
                        </div>

                        <div className="filter-section">
                            <h4>Sort By</h4>
                            <select
                                value={filters.date}
                                onChange={(e) => handleFilterChange('date', e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                {filters.type.includes('goal') && <option value="priority">Priority</option>}
                            </select>
                        </div>

                        {/* Only show priority filter if Goals is selected or generalized */}
                        <div className="filter-section">
                            <h4>Priority (Goals)</h4>
                            <select
                                value={filters.priority}
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                            >
                                <option value="">Any</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                    </div>
                </aside>

                <main className="search-results">
                    {loading ? (
                        <div className="loading">Searching...</div>
                    ) : results.length > 0 ? (
                        <div className="results-grid">
                            {results.map(renderResultItem)}
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>No results found matching your criteria.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SearchPage;
