Simplified data type of what is needed from the event.
```json
{
  "data": {
    "object": {
      "id": "cs_test_a1WvnB3eDguI7dxy6llB3LBqeRB5l2QhNNr16hRCO6i5k0dAHJX0By35np",
      "client_reference_id": "cllnlqdff0d103i8tvi0yrx5b",
      "customer": "cus_OV8zF7RMsBo1K1",
      "customer_email": "test@thepmftool.com",
      "subscription": "sub_1NiEd5CwEGCgBV8c3ON1VNaz"
    }
  }
}
```

Full event data sample.
```json
{
  "id": "evt_1NiEd7CwCgBEGV8OI8Pi0Uu0",
  "object": "event",
  "api_version": "2023-08-16",
  "created": 1692787781,
  "data": {
    "object": {
      "id": "cs_test_a1WvnB3eDguI7dxy6llB3LBqeRB5l2QhNNr16hRCO6i5k0dAHJX0By35np",
      "object": "checkout.session",
      "after_expiration": null,
      "allow_promotion_codes": null,
      "amount_subtotal": 100000,
      "amount_total": 100000,
      "automatic_tax": {
        "enabled": false,
        "status": null
      },
      "billing_address_collection": null,
      "cancel_url": "https://localhost:8080/#/subscription/plans?redirectReason=cancelled",
      "client_reference_id": "cllnlqdff0d103i8tvi0yrx5b",
      "consent": null,
      "consent_collection": null,
      "created": 1692787715,
      "currency": "sgd",
      "currency_conversion": null,
      "custom_fields": [],
      "custom_text": {
        "shipping_address": null,
        "submit": null
      },
      "customer": "cus_OV8zF7RMsBo1K1",
      "customer_creation": "always",
      "customer_details": {
        "address": {
          "city": null,
          "country": "SG",
          "line1": null,
          "line2": null,
          "postal_code": null,
          "state": null
        },
        "email": "test@thepmftool.com",
        "name": "JJ",
        "phone": null,
        "tax_exempt": "none",
        "tax_ids": []
      },
      "customer_email": "test@thepmftool.com",
      "expires_at": 1692874115,
      "invoice": "in_1NiEd5CwGVCgBE8ONCYkwuFM",
      "invoice_creation": null,
      "livemode": false,
      "locale": null,
      "metadata": {},
      "mode": "subscription",
      "payment_intent": null,
      "payment_link": null,
      "payment_method_collection": "always",
      "payment_method_options": null,
      "payment_method_types": [
        "card"
      ],
      "payment_status": "paid",
      "phone_number_collection": {
        "enabled": false
      },
      "recovered_from": null,
      "setup_intent": null,
      "shipping_address_collection": null,
      "shipping_cost": null,
      "shipping_details": null,
      "shipping_options": [],
      "status": "complete",
      "submit_type": null,
      "subscription": "sub_1NiEd5CwEGCgBV8c3ON1VNaz",
      "success_url": "https://localhost:8080/#/subscription/plans?redirectReason=success&session_id={CHECKOUT_SESSION_ID}",
      "total_details": {
        "amount_discount": 0,
        "amount_shipping": 0,
        "amount_tax": 0
      },
      "url": null
    }
  },
  "livemode": false,
  "pending_webhooks": 2,
  "request": {
    "id": null,
    "idempotency_key": null
  },
  "type": "checkout.session.completed"
}
```