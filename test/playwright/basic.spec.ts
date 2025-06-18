import basicSetup from "../wallet-setup/basic.setup";
import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/TSender/);
});

test("should show the airdrop form when connected, otherwise, not", async ({
  page,
  context,
  metamaskPage,
  extensionId,
}) => {
  await page.goto("/");
  
  // Check we see "please connect wallet"
  await expect(page.getByText("Please connect a wallet")).toBeVisible();
  
  const metamask = new MetaMask(
    context,
    metamaskPage,
    basicSetup.walletPassword,
    extensionId
  );

  // Connect to dapp first
  await page.getByTestId("rk-connect-button").click();
  
  // Wait for MetaMask option
  await page.getByTestId("rk-wallet-option-io.metamask").waitFor({
    state: "visible",
    timeout: 30000,
  });
  
  await page.getByTestId("rk-wallet-option-io.metamask").click();
  
  // Wait for connection to complete
  await metamask.connectToDapp();
  
  // Verify page is still active after connection
  await expect(page.getByText("Please connect a wallet")).not.toBeVisible();
  
  // Ensure both contexts are still alive before network operations
  if (page.isClosed() || metamaskPage.isClosed()) {
    throw new Error("Page context was closed during connection");
  }

  const customNetwork = {
    name: "Anvil",
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 31337,
    symbol: "ETH",
  };

  // Add network - let it fail cleanly if context is closed
  await metamask.addNetwork(customNetwork);
  
  // Check if the airdrop form is visible
  await expect(page.getByText("Token Address")).toBeVisible();
});
