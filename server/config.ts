const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
}

export default {
  production,
  https: production,
  staticResourceCacheDuration: 20,
  redis: {
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    prisonApi: {
      url: get('PRISON_API_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: get('PRISON_API_TIMEOUT_RESPONSE', 10000),
        deadline: get('PRISON_API_TIMEOUT_DEADLINE', 10000),
      },
      agent: new AgentConfig(),
    },
    warrantFolder: {
      url: get('WARRANT_FOLDER_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: get('WARRANT_FOLDER_TIMEOUT_RESPONSE', 10000),
        deadline: get('WARRANT_FOLDER_TIMEOUT_DEADLINE', 10000),
      },
      agent: new AgentConfig(),
    },
    adjustments: {
      url: get('ADJUSTMENTS_API_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: get('ADJUSTMENTS_API_TIMEOUT_RESPONSE', 10000),
        deadline: get('ADJUSTMENTS_API_TIMEOUT_DEADLINE', 10000),
      },
      agent: new AgentConfig(),
    },
  },
  services: {
    calculateReleaseDatesUI: {
      url: get('CALCULATE_RELEASE_DATES_URL', 'http://localhost:8080', requiredInProduction),
    },
    digitalPrisonServices: {
      url: get('DIGITAL_PRISON_SERVICES_URL', 'http://localhost:3000/dps', requiredInProduction),
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
}
