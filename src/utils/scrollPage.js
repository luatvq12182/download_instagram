

const scrollPage = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 10;

            let timer = setInterval(() => {
                // let scrollHeight = document.body.scrollHeight;
                let scrollHeight = 2000;

                window.scrollBy(0, distance);

                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                };
            }, 10);

        });
    });
};

module.exports = scrollPage;