import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import unicorn from "eslint-plugin-unicorn";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        plugins: {
            unicorn,
        },
        rules: {
            "unicorn/filename-case": [
                "error",
                {
                    case: "kebabCase",
                },
            ],
            "@typescript-eslint/no-unused-vars": "off",
            "react/no-unescaped-entities": "off",
            "@next/next/no-img-element": "off",
        },
    },
];

export default eslintConfig;
