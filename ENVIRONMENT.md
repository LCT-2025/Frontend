# Environment Configuration

The frontend now supports configurable backend URLs through environment variables.

## Quick Setup

Run the setup script to create the environment file:

```bash
npm run setup-env
```

This will create a `.env.local` file with default configuration.

## Manual Setup

Create a `.env.local` file in the Frontend directory with:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Development Configuration
VITE_DEV_MODE=true
```

## Configuration Options

### VITE_API_BASE_URL
- **Default**: `http://localhost:8080`
- **Description**: The base URL of your backend server
- **Examples**:
  - Local development: `http://localhost:8080`
  - Remote server: `http://your-server.com:8080`
  - HTTPS: `https://your-domain.com`

### VITE_DEV_MODE
- **Default**: `true`
- **Description**: Enables development mode features
- **Values**: `true` or `false`

## Usage Examples

### Local Development
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Remote Backend
```env
VITE_API_BASE_URL=http://192.168.1.100:8080
```

### Production with HTTPS
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Important Notes

1. **Restart Required**: After changing environment variables, restart the development server:
   ```bash
   npm run dev
   ```

2. **Build Time**: Environment variables are embedded at build time, not runtime.

3. **Security**: Never commit `.env.local` to version control - it's already in `.gitignore`.

4. **CORS**: Make sure your backend allows requests from your frontend domain.

## Troubleshooting

### CORS Issues
If you get CORS errors, update your backend CORS configuration to include your frontend URL.

### Connection Refused
- Check if the backend server is running
- Verify the port number is correct
- Ensure the URL is accessible from your machine

### Environment Variables Not Working
- Make sure the file is named `.env.local` (not `.env`)
- Restart the development server after changes
- Check that variable names start with `VITE_`
