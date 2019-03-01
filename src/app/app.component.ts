import { Component, Output, OnInit } from '@angular/core';
import { Product } from './product';
import { CartShopping } from './cartshopping';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shopping-gatesakagi';
  cartshopping: CartShopping[] = [];
  cartshoppingTotalPrice: Number = 0;
  maxCartId = 0;
  searchString = '';
  products: Product[] = [];
  productsArray = [];
  currentPage = 0;
  constructor() {
  }
  ngOnInit() {
    this.getProductsFromJson();
  }

  getProductsFromJson() {
    const eachCounts = 10;
    let tmpProducts: Product[] = [];
    let pageMaxCount = 0;
    from(fetch('../assets/pros-list.json').then(res => res.json())).subscribe(value => {
      tmpProducts = value;
      pageMaxCount = Math.ceil(tmpProducts.length / eachCounts);
      for (let count = 0; count < pageMaxCount; count++) {
        const tmpProductItem: Product[] = [];
        for (let idx = 0; idx < eachCounts; idx++) {
          const tmpProductsIndex = 10 * count + idx;
          if (tmpProducts[tmpProductsIndex]) { tmpProductItem.push(tmpProducts[tmpProductsIndex]); }
        }
        this.productsArray.push(tmpProductItem);
        this.products = this.productsArray[0];
      }
    });
  }

  addCart(productIndex) {
    const isHaveCarted = this.cartshopping.filter(item => item.cartProductIndex === productIndex);
    if (isHaveCarted.length) {
      this.cartshopping = this.cartshopping.map((item) => {
        if (item.cartProductIndex === productIndex) {
          Object.assign({}, item, {
            cartCount: item.cartCount++
          });
        }
        return item;
      });
    } else {
      const targetProduct: Product = this.products[productIndex];
      this.cartshopping.push({
        cartIndex: this.maxCartId++,
        cartProductIndex: targetProduct.index,
        cartTitle: targetProduct.name,
        cartPrice: targetProduct.price,
        cartCount: 1
      });
    }
    this.calcCartshoppingTotalPrice();
  }

  removeCart(productIndex) {
    this.cartshopping = this.cartshopping.map((item) => {
      if (item.cartProductIndex === productIndex) {
        Object.assign({}, item, {
          cartCount: item.cartCount--
        });
      }
      return item;
    });
    this.cartshopping = this.cartshopping.filter(item => item.cartCount > 0);
    this.calcCartshoppingTotalPrice();
  }
  calcCartshoppingTotalPrice() {
    this.cartshoppingTotalPrice = this.cartshopping.map(function (item) {
      return item.cartPrice * item.cartCount;
    }).reduceRight(function (prev, element) {
      return prev + element;
    }, 0);
  }

  searchProductName() {
    console.log(this.searchString);
    const searchProductsResult: Product[] = [];
    this.getProductsFromJson();
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].name.match(this.searchString) != null) {
        searchProductsResult.push(this.products[i]);
      }
    }
    this.products = searchProductsResult;
  }
  clearSearchResult() {
    this.searchString = '';
    this.getProductsFromJson();
  }
  refreshProductArray(idx) {
    this.products = this.productsArray[idx];
    this.currentPage = idx;
  }

  prevProducts() {
    if (this.currentPage > 0) {
      this.refreshProductArray(this.currentPage - 1);
    }
  }
  nextProducts() {
    if (this.currentPage < this.productsArray.length - 1) {
      this.refreshProductArray(this.currentPage + 1);
    }
  }
}
