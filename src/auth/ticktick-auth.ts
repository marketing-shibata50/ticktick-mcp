import axios from 'axios';
import { TickTickConfig, AuthTokens } from '../types/ticktick.js';

export class TickTickAuth {
  private config: TickTickConfig;
  private baseURL = 'https://ticktick.com';

  constructor(config: TickTickConfig) {
    this.config = config;
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'tasks:read tasks:write',
    });

    if (state) {
      params.append('state', state);
    }

    return `${this.baseURL}/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<AuthTokens> {
    try {
      const response = await axios.post(
        `${this.baseURL}/oauth/token`,
        {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
          grant_type: 'authorization_code',
          code,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const tokens: AuthTokens = response.data;
      this.config.accessToken = tokens.access_token;
      this.config.refreshToken = tokens.refresh_token;

      return tokens;
    } catch (error) {
      throw new Error(`Failed to exchange code for token: ${error}`);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<AuthTokens> {
    if (!this.config.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/oauth/token`,
        {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: this.config.refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const tokens: AuthTokens = response.data;
      this.config.accessToken = tokens.access_token;
      this.config.refreshToken = tokens.refresh_token;

      return tokens;
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error}`);
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | undefined {
    return this.config.accessToken;
  }

  /**
   * Set access token manually
   */
  setAccessToken(accessToken: string, refreshToken?: string): void {
    this.config.accessToken = accessToken;
    if (refreshToken) {
      this.config.refreshToken = refreshToken;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.config.accessToken;
  }

  /**
   * Get authorization headers for API requests
   */
  getAuthHeaders(): Record<string, string> {
    if (!this.config.accessToken) {
      throw new Error('No access token available. Please authenticate first.');
    }

    return {
      Authorization: `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json',
    };
  }
}