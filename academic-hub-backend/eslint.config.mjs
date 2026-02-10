import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.js", "**/*.ts"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            parser: tsParser,
            globals: {
                ...globals.node,
                ...globals.jest
            }
        },
        plugins: {
            "@typescript-eslint": tseslint
        },
        rules: {
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
            "no-console": "off"
        }
    },
    {
        ignores: ["node_modules/", "dist/", "coverage/"]
    }
];
