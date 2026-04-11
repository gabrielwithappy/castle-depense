import { chromium } from 'playwright';

const url = 'http://localhost:8080';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleMessages = [];
const pageErrors = [];

page.on('console', (msg) => consoleMessages.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', (err) => pageErrors.push(err.message));

try {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  const menuState = await page.evaluate(() => {
    const game = window.game;
    if (!game) {
      return { hasGame: false };
    }

    const menuScene = game.scene.keys.MenuScene;
    const gameScene = game.scene.keys.GameScene;

    return {
      hasGame: true,
      menuActive: !!menuScene && menuScene.scene.isActive(),
      gameActive: !!gameScene && gameScene.scene.isActive(),
      scaleWidth: game.scale.width,
      scaleHeight: game.scale.height,
      easyButton:
        menuScene?.children?.list
          ?.filter((item) => item.type === 'Rectangle')
          ?.map((item) => ({
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height
          }))[0] ?? null
    };
  });

  if (!menuState.hasGame) {
    throw new Error('window.game not found');
  }

  if (!menuState.menuActive) {
    throw new Error('MenuScene is not active');
  }

  if (!menuState.easyButton) {
    throw new Error('Could not find difficulty button in MenuScene');
  }

  await page.mouse.click(menuState.easyButton.x, menuState.easyButton.y);
  await wait(1500);

  const gameState = await page.evaluate(() => {
    const game = window.game;
    const menuScene = game.scene.keys.MenuScene;
    const gameScene = game.scene.keys.GameScene;

    return {
      menuActive: !!menuScene && menuScene.scene.isActive(),
      gameActive: !!gameScene && gameScene.scene.isActive(),
      remainingTime: gameScene?.remainingTime ?? null,
      playerEnergy: gameScene?.playerEnergy ?? null,
      hasPlayerCastle: !!gameScene?.playerCastle,
      hasAiCastle: !!gameScene?.aiCastle,
      deckSize: gameScene?.playerDeck?.length ?? null
    };
  });

  const screenshotPath = 'D:/01_PRJ/castle-depense/.playwright-control-test.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });

  console.log(
    JSON.stringify(
      {
        status: response?.status() ?? null,
        menuState,
        gameState,
        consoleMessages,
        pageErrors,
        screenshotPath
      },
      null,
      2
    )
  );
} finally {
  await browser.close();
}
