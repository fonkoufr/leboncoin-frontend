import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getAnnonces,
  createAnnonce,
  getAnnonceById,
  registerUser,
  loginUser,
  type Annonce,
  type User,
  type UserCredentials,
  type UserRegister
} from './api'

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAnnonces', () => {
    it('should fetch all annonces successfully', async () => {
      const mockAnnonces: Annonce[] = [
        {
          id: 1,
          titre: 'iPhone 15',
          description: 'Neuf',
          prix: 999,
          ville: 'Paris'
        },
        {
          id: 2,
          titre: 'MacBook Pro',
          description: 'Occasion',
          prix: 1500,
          ville: 'Lyon'
        }
      ]

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnnonces
      })

      const result = await getAnnonces()

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/annonces')
      )
      expect(result).toEqual(mockAnnonces)
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return empty array on error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const result = await getAnnonces()

      expect(result).toEqual([])
    })

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      const result = await getAnnonces()

      expect(result).toEqual([])
    })
  })

  describe('getAnnonceById', () => {
    it('should fetch a single annonce by ID', async () => {
      const mockAnnonce: Annonce = {
        id: 1,
        titre: 'iPhone 15',
        description: 'État neuf',
        prix: 999,
        ville: 'Paris',
        imageUrl: 'https://example.com/iphone.jpg'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnnonce
      })

      const result = await getAnnonceById(1)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/annonces/1')
      )
      expect(result).toEqual(mockAnnonce)
      expect(result.id).toBe(1)
    })

    it('should throw error when annonce not found', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(getAnnonceById(999)).rejects.toThrow('Annonce introuvable')
    })
  })

  describe('createAnnonce', () => {
    it('should create a new annonce', async () => {
      const newAnnonce = {
        titre: 'Vélo',
        description: 'Très bon état',
        prix: 150,
        ville: 'Marseille'
      }

      const createdAnnonce: Annonce = {
        id: 3,
        ...newAnnonce
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => createdAnnonce
      })

      const result = await createAnnonce(newAnnonce)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/annonces'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result).toEqual(createdAnnonce)
      expect(result.id).toBeDefined()
    })

    it('should throw error on server error', async () => {
      const newAnnonce = {
        titre: 'Invalid',
        description: 'Test',
        prix: -100,
        ville: 'Test'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad request'
      })

      await expect(createAnnonce(newAnnonce)).rejects.toThrow()
    })
  })

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const credentials: UserRegister = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@example.com',
        motDePasse: 'password123'
      }

      const createdUser: User = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@example.com'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => createdUser
      })

      const result = await registerUser(credentials)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/utilisateurs/register'),
        expect.objectContaining({
          method: 'POST'
        })
      )
      expect(result).toEqual(createdUser)
      expect(result.email).toBe('jean@example.com')
    })

    it('should throw error on registration failure', async () => {
      const credentials: UserRegister = {
        nom: 'Test',
        email: 'existing@example.com',
        motDePasse: 'password123'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        text: async () => 'Email already exists'
      })

      await expect(registerUser(credentials)).rejects.toThrow('Email already exists')
    })
  })

  describe('loginUser', () => {
    it('should login user with correct credentials', async () => {
      const credentials: UserCredentials = {
        email: 'jean@example.com',
        motDePasse: 'password123'
      }

      const loggedInUser: User = {
        id: 1,
        nom: 'Dupont',
        email: 'jean@example.com'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => loggedInUser
      })

      const result = await loginUser(credentials)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/utilisateurs/login'),
        expect.objectContaining({
          method: 'POST'
        })
      )
      expect(result).toEqual(loggedInUser)
    })

    it('should throw error with incorrect credentials', async () => {
      const credentials: UserCredentials = {
        email: 'wrong@example.com',
        motDePasse: 'wrongpassword'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 401
      })

      await expect(loginUser(credentials)).rejects.toThrow('Email ou mot de passe incorrect')
    })

    it('should include Accept header in login request', async () => {
      const credentials: UserCredentials = {
        email: 'test@example.com',
        motDePasse: 'test'
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, nom: 'Test', email: 'test@example.com' })
      })

      await loginUser(credentials)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      )
    })
  })

  describe('API URL construction', () => {
    it('should call correct endpoint for getAnnonces', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })

      await getAnnonces()

      const callUrl = (global.fetch as any).mock.calls[0][0]
      expect(callUrl).toContain('annonces')
      expect(callUrl).not.toContain('undefined')
    })
  })
})
