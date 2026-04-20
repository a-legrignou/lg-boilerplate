import { fixupConfigRules, fixupPluginRules } from '@eslint/eslintrc';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import _import from 'eslint-plugin-import';
import { fixupConfigRules as _fixupConfigRules } from '@eslint/eslintrc';

export default [
  ...fixupConfigRules([
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
        parserOptions: {
          project: '../../tsconfig.json',
          tsconfigRootDir: import.meta.dirname,
        },
      },
      plugins: {
        '@typescript-eslint': typescriptEslint,
        import: fixupPluginRules(_import),
        prettier,
      },
      rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
            ],
            'newlines-between': 'always',
          },
        ],
      },
    },
  ]),
];
