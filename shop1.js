class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    }
    setAvailable(status) {
        this.available = status;
    }
}

class GoodList {
    #goods;
    constructor(filter, sortPrice, sortDir) {
        this.#goods = [];
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }

    get list() {
        const forSale = this.#goods.filter((good) =>
            this.filter.test(good.name)
        );

        if (!this.sortPrice) {
            return forSale;
        }

        if (this.sortDir) {
            return forSale.sort((a, b) => a.price - b.price);
        }
        return forSale.sort((a, b) => b.price - a.price);
    }

    add(good) {
        this.#goods.push(good);
    }

    remove(id) {
        const getIndex = this.#goods.findIndex((good) => good.id == id);
        if (getIndex != undefined) {
            this.#goods.splice(getIndex, 1);
        }
        return getIndex;
    }
}

class BasketGood extends Good {
    constructor(id, name, description, sizes, price, available, amount) {
        super(id, name, description, sizes, price, available);
        this.amount = amount;
    }
}

class Basket {
    constructor() {
        this.goods = [];
    }
    get totalAmount() {
        return this.goods.map((good) => good.amount).reduce((a, b) => a + b, 0);
    }
    get totalSum() {
        return this.goods.reduce((a, b) => a + b.amount * b.price, 0);
    }
    add(good, amount) {
        let currentIndex = this.goods.findIndex(
            (product) => product.id === good.id
        );
        if (currentIndex > 0) {
            this.goods[currentIndex].amount += amount;
        } else {
            let addProduct = new BasketGood(
                good.id,
                good.name,
                good.description,
                good.sizes,
                good.price,
                good.available,
                amount
            );
            this.goods.push(addProduct);
        }
    }
    remove(good, amount) {
        let currentIndex = this.goods.findIndex(
            (product) => product.id === good.id
        );
        if (currentIndex >= 0) {
            if (this.goods[currentIndex].amount - amount <= 0 || amount === 0) {
                this.goods.splice(currentIndex, 1);
            } else {
                this.goods[currentIndex].amount -= amount;
            }
        }
    }

    clear() {
        this.goods.length = 0;
    }
    
    removeUnavailable() {
        this.goods
            .filter((item) => item.available === false)
            .forEach((product) => this.remove(product));
    }
}

const firstItem = new Good(
    1,
    "Jeans",
    "material: denim, color: blue",
    ["M", "L", "XL"],
    5000,
    true
);
const secondItem = new Good(
    2,
    "Baseball cap",
    "material: cotton, color: red-white",
    ["55", "56", "58"],
    800,
    true
);
const thirdItem = new Good(
    3,
    "T-shirt",
    "material: cotton, color: assorted colors",
    ["M", "L", "XL"],
    1000,
    true
);
const fourthItem = new Good(
    4,
    "Sneakers",
    "brand: nike, color: blue",
    ["40", "41", "42"],
    9000,
    true
);
const fifthItem = new Good(
    5,
    "Socks",
    "material: cotton, color: white",
    ["40", "41", "42"],
    300,
    true
);

fifthItem.setAvailable(false);

const catalog = new GoodList(/\w/i, false, false);
catalog.add(firstItem);
catalog.add(secondItem);
catalog.add(thirdItem);
catalog.add(fourthItem);
catalog.add(fifthItem);

console.log(`Goods currently in catalog:` , catalog.list);

// catalog.sortPrice = true;
// console.log(`Sorted catalog depending on price: `, catalog.list)

// catalog.remove(5);
// console.log(`Removed item from catalog ...current catolog: `, catalog.list)


const basket = new Basket();
basket.add(firstItem, 3);
basket.add(secondItem, 2);
basket.add(thirdItem, 1);
basket.add(fourthItem,1);
basket.add(fifthItem,5);



console.log(`Total items in the basket: ${basket.totalAmount}`);
console.log(
    `Total sum for ${basket.totalAmount} items in the basket is: ${basket.totalSum} roubles`
);

// basket.remove(firstItem,5);
// console.log(basket.goods);

basket.removeUnavailable();
console.log(basket.goods);

basket.clear();

console.log(basket.goods);