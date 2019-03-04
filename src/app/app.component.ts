import { Component, Output, OnInit } from '@angular/core';
import { Product } from './product';
import { CartShopping } from './cartshopping';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  products: Product[];
  productsArray = [];
  pageCountArray = [];
  currentPage = 0;
  eachCounts = 10;
  pageMaxCount = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getProductsFromJson().subscribe(data => this.setProductsArray(data));
  }

  getProductsFromJson(): Observable<Product[]> {
    return this.http.get<Product[]>('../assets/pros-list.json');
  }

  addCart(idx) {
    const productInCart = this.cartshopping.find(
      x => x.cartProductIndex === idx
    );

    if (productInCart) {
      this.cartshopping = this.cartshopping.map(item =>
        item.cartProductIndex === idx
          ? { ...item, cartCount: ++item.cartCount }
          : item
      );
    } else {
      const product = this.products[idx];

      this.cartshopping = [
        ...this.cartshopping,
        {
          cartIndex: this.maxCartId++,
          cartProductIndex: product.index,
          cartTitle: product.name,
          cartPrice: product.price,
          cartCount: 1
        }
      ];
    }
    this.calcCartshoppingTotalPrice();
  }

  removeCart(productIndex) {
    this.cartshopping = this.cartshopping
      .map(item =>
        item.cartProductIndex === productIndex
          ? { ...item, cartCount: --item.cartCount }
          : item
      )
      .filter(item => item.cartCount > 0);

    this.calcCartshoppingTotalPrice();
  }

  calcCartshoppingTotalPrice() {
    this.cartshoppingTotalPrice = this.cartshopping
      .map(function(item) {
        return item.cartPrice * item.cartCount;
      })
      .reduce(function(prev, element) {
        return prev + element;
      }, 0);
  }

  searchProductName() {
    this.getProductsFromJson()
      .pipe(
        map(data => {
          return data.filter(x => x.name.includes(this.searchString));
        }),
        tap(() => (this.currentPage = 0))
      )
      .subscribe(data => this.setProductsArray(data));
  }

  clearSearchResult() {
    this.searchString = '';
    this.loadData();
  }

  refreshProductArray(idx) {
    this.currentPage = idx;
  }

  prevProducts() {
    if (this.currentPage > 0) {
      this.currentPage -= 1;
    }
  }

  nextProducts() {
    if (this.currentPage < this.pageMaxCount - 1) {
      this.currentPage = this.currentPage + 1;
    }
  }

  private setProductsArray(data: Product[]) {
    this.products = data;
    this.pageMaxCount = Math.ceil(data.length / this.eachCounts);
    this.pageCountArray = Array(this.pageMaxCount).fill(0);
  }
}
