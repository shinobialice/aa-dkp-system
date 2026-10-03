import nextConfig from "eslint-config-next";

const config = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "scratch/**"],
  },
  ...nextConfig,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/self-closing-comp": "error",
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": "error",
      "react/jsx-no-useless-fragment": "error",
      eqeqeq: ["error", "smart"],
      "prefer-const": "error",
      "object-shorthand": "error",
      "no-else-return": "error",
      curly: ["error", "multi-line"],

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "no-nested-ternary": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "max-lines": [
        "warn",
        { max: 200, skipBlankLines: true, skipComments: true },
      ],
      "max-depth": ["warn", 3],
      complexity: ["warn", 15],
    },
  },
  {
    files: [
      "src/shared/config/changelog.ts",
      "src/shared/lib/dbTypes.ts",
      "src/**/*Data.ts",
      "src/widgets/profile/equipment/itemsData/**",
      "src/widgets/profile/archetype/skills/**",
      "src/widgets/profile/archetype/classCombinations.ts",
      "src/widgets/info/GuildRules/ruleSections.tsx",
    ],
    rules: {
      "max-lines": "off",
    },
  },
  {
    files: ["src/shared/ui/**/*.tsx"],
    rules: {
      "max-lines": "off",
      complexity: "off",
      "react/function-component-definition": "off",
    },
  },
];

export default config;
