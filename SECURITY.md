# Security Policy

## Security Analysis

This project uses Semgrep for continuous security analysis. The analysis runs:
- On all pull requests
- On pushes to main
- Daily at midnight UTC
- Can be triggered manually via GitHub Actions

### Severity Levels

- **ERROR**: Must be fixed before merge
- **WARNING**: Should be reviewed
- **INFO**: Best practice suggestions

### Custom Rules

We have custom Semgrep rules for:
- WebSocket security
- XSS prevention
- Message validation
- Type safety
- Error handling

### Running Locally

To run Semgrep locally:

```bash
# Install Semgrep
pip install semgrep

# Run analysis
semgrep --config .semgrep.yml ./app

# Run with all default rules
semgrep --config auto ./app
```

## Reporting Security Issues

If you discover a security vulnerability, please do NOT open an issue. Email [vhsdev@tutanota.com](mailto:vhsdev@tutanota.com) instead.