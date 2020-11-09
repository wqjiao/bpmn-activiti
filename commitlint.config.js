module.exports = {
    extends: ['@commitlint/config-conventional', 'cz'],
    rules: {
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 72],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
        'subject-empty': [0],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [0],
        'type-empty': [0],
        'type-enum': [0],
    },
};
