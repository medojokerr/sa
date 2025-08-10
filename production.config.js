// Production configuration for KYCtrust
module.exports = {
  // Database settings
  database: {
    // Add your production database URL
    POSTGRES_URL: process.env.POSTGRES_URL,
    
    // Connection pool settings
    maxConnections: 20,
    idleTimeout: 30000,
  },
  
  // Security settings
  security: {
    // Add your security headers
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    
    // CORS settings
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://kyctrust.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  },
  
  // Performance settings
  performance: {
    // Cache settings
    staticCache: '1y',
    apiCache: '5m',
    
    // Compression
    gzip: true,
    brotli: true,
  },
  
  // Analytics
  analytics: {
    // Add your analytics configuration
    enabled: true,
    provider: 'custom',
  },
  
  // Monitoring
  monitoring: {
    // Error tracking
    errorTracking: true,
    
    // Performance monitoring
    performanceTracking: true,
    
    // Log level
    logLevel: 'error',
  },
}
