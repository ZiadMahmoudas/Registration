import { Component } from '@angular/core';
declare var google: any;
declare var Stripe: any;
@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout {
selectedPaymentMethod:boolean = false;
stand(){
  this.selectedPaymentMethod = true
}
  paymentsClient: any;
 stripe: any;
 ngAfterViewInit() {
    // @ts-ignore
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '10.00' 
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert('Transaction completed by ' + details.payer.name.given_name);
            // details for backend
        });
      }
    }).render('#paypal-button-container');

    this.paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });

    // const button = this.paymentsClient.createButton({
    //   onClick: () => this.onGooglePaymentButtonClicked()
    // });

    // document.getElementById('container')?.appendChild(button);

     this.stripe = Stripe('pk_test_51RsgCh2Quhd825SJHNiynmjJEx0LfU7gqhs62I1A4ZKuUygHWLrJv3bAci3OyybtX8F2dMJiSBFtzBUv0ZVtchAi00VsQuDrbQ');
  }
   async checkout() {
    const response = await fetch('https://localhost:7054/api/payments/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const session = await response.json();
    this.stripe.redirectToCheckout({ sessionId: session.id });
  }
  //  onGooglePaymentButtonClicked() {
  //   const paymentDataRequest = this.getGooglePaymentDataRequest();
  //   this.paymentsClient.loadPaymentData(paymentDataRequest)
  //     .then((paymentData: any) => {
  //        // details for backend
  //       console.log(paymentData);
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //     });
  // }

  // getGooglePaymentDataRequest() {
  // // استدعاء API للباك إند لجلب الإعدادات الديناميكية
  // return this.http.get('/api/payments/googlepay-config').toPromise().then((config: any) => {
  //   return {
  //     apiVersion: 2,
  //     apiVersionMinor: 0,
  //     allowedPaymentMethods: [{
  //       type: 'CARD',
  //       parameters: {
  //         allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
  //         allowedCardNetworks: ['MASTERCARD', 'VISA']
  //       },
  //       tokenizationSpecification: {
  //         type: 'PAYMENT_GATEWAY',
  //         parameters: {
  //           gateway: config.gateway,
  //           gatewayMerchantId: config.gatewayMerchantId
  //         }
  //       }
  //     }],
  //     merchantInfo: {
  //       merchantId: config.merchantId,
  //       merchantName: config.merchantName
  //     },
  //     transactionInfo: {
  //       totalPriceStatus: 'FINAL',
  //       totalPrice: config.totalPrice,
  //       currencyCode: config.currencyCode,
  //       countryCode: config.countryCode
  //     }
  //   };
  // });
// }

}
