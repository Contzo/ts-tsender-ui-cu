import basicSetup from "../wallet-setup/basic.setup";
import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;
test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TSender/);
});

test("should show the airdrop form when connected, otherwise, not", async ({
  page,
  context,
  metamaskPage,
  extensionId,
}) => {
  await page.goto("/");
  // check we see "please connect wallet"
  await expect(page.getByText("Please connect a wallet")).toBeVisible();
  const metamask = new MetaMask(
    context, // browser context
    metamaskPage, // the separate Metamask tab
    basicSetup.walletPassword, // the passowod for our test wallet.
    extensionId // the unique chrome extension id of MetaMask
  );
  await page.getByTestId("rk-connect-button").click();
  // wait for the connect pop up to be visible.
  await page.getByTestId("rk-wallet-option-io.metamask").waitFor({
    state: "visible",
    timeout: 30000, // waits up to 30sec for the pop-up to be visible
  });
  await page.getByTestId("rk-wallet-option-io.metamask").click();
  await metamask.connectToDapp();

  const customNetwork = {
    name: "Anvil",
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 31337,
    symbol: "ETH",
  };

  await metamask.addNetwork(customNetwork);
  // check if the airdrop form is vible by seaching for one of its input field names
  await expect(page.getByText("Token Address")).toBeVisible();
});
