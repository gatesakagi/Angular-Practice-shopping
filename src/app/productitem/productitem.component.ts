import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-productitem',
  templateUrl: './productitem.component.html',
  styleUrls: ['./productitem.component.css']
})
export class ProductitemComponent implements OnInit {

  @Input() products: Product[];

  @Output() addCart = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  addProductToCart(product) {
    this.addCart.emit(product);
  }

}
