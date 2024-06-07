// PowerAuth

// Can initialize
import { PowerAuth } from "./power-auth"
import { MockEncryption } from "@powerauth/lib-testing/mock-encryption"
import { MockSecureLocalStorage } from "@powerauth/lib-testing/mock-secure-local-storage"
import { MemoryAccountRepository } from "./memory-account-repository"
import { MockCloudStorage } from "@powerauth/lib-testing/mock-cloud-storage"

jest.mock("app/services/powerauth-core/power-auth-backend")

test("it can initialize power auth", async () => {
  const powerAuth = new PowerAuth()
  const encryption = new MockEncryption()
  const secureLocalStorage = new MockSecureLocalStorage()
  const accountRepository = new MemoryAccountRepository()

  powerAuth.init({
    encryption,
    secureLocalStorage,
    accountRepository,
  })

  expect(powerAuth.isInitialized()).toBe(true)
  expect(powerAuth.hasBackend()).toBe(false)
  expect(powerAuth.encryption()).toBe(encryption)
  expect(powerAuth.secureLocalStorage()).toBe(secureLocalStorage)
  expect(powerAuth.accounts()).toBe(accountRepository)
  expect(await powerAuth.getDeviceAsync()).toBe(null)
})

// Can sync with backend
test("it can sync with the backend", async () => {
  const powerAuth = new PowerAuth()
  const encryption = new MockEncryption()
  const secureLocalStorage = new MockSecureLocalStorage()
  const accountRepository = new MemoryAccountRepository()

  powerAuth.init({
    encryption,
    secureLocalStorage,
    accountRepository,
  })

  await powerAuth.initBackend(new MockCloudStorage())
})

// PowerAuthBackend

// Can initialize
// Backend already exists
// Backend not exists
// Backend exists but device not found
// Invalid backend (no devices at all or corrupt)

// Can get all current devices

// Can get join requests

// Can add a new device



