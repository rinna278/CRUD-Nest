import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettier from 'prettier';
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin'; // Thêm plugin TypeScript
import eslintParserTypeScript from '@typescript-eslint/parser'; // Thêm parser TypeScript

export default [
  {
    files: ['**/*.js', '**/*.ts'], // Áp dụng cho cả JS và TS
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: eslintParserTypeScript, // Sử dụng parser của TypeScript
    },
    plugins: {
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
      '@typescript-eslint': eslintPluginTypeScript, // Thêm plugin TypeScript
    },
    rules: {
      // 'no-unused-vars': 'warn',
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn', // Thêm quy tắc cho TypeScript
      '@typescript-eslint/explicit-module-boundary-types': 'warn', // Cảnh báo nếu thiếu kiểu trả về
      'prettier/prettier': [
        'error',
        (await prettier.resolveConfig('./')) || {},
      ],
    },
  },
  {
    rules: {
      ...eslintConfigPrettier.rules,
    },
  },
];