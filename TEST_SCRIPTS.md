# PandaGarde test scripts

## Run the DFA-focused tests

```bash
npm run test:dfa
```

Covers:
- DFA journey storage and progress rules
- DFA scoring engine (basic and advanced)
- DFA journey stepper rendering
- DFA score overview tier switching and PDF export trigger

## Run the launch smoke check

```bash
npm run test:launch-smoke
```

This runs the DFA-focused tests and then builds the production bundle.

## Watch the DFA suite while editing

```bash
npm run test:watch-dfa
```

## Shell helper

```bash
./scripts/test-dfa-launch.sh
```
