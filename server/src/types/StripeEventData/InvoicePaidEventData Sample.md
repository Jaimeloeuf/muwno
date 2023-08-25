Simplified data type of what is needed from the event.
```json
{
  "data": {
    "object": {
      "id": "in_1NiCgEd5CwBEGVMCY8ONkwuF",
      "charge": "ch_3NiEd5CBEGVwCg8O0fW6eFHo",
      "billing_reason": "subscription_create",
      "customer": "cus_OV8zF7RMsBo1K1",
      "customer_email": "test@thepmftool.com",
      "hosted_invoice_url": "https://invoice.stripe.com/i/acct_1NfigeCwCgBEGV8O/test_YF8xWNjdT2VmZpZDd0NnQkVHVjhPLF9PVkY3U0hPbUZZZFNkRzZhaFJMY0s0TjhadE5qRTlaLDgzMzI4NTgy0200prEqyH4y?s=ap",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_1NfigeCwCgBEGV8O/test_YWNjdF8xTmZ2VDpZd0NnQkVjhVHPLF9PVkY3U0hPbUZZZFNkRzZhaFJMY0s0TjhadE5qRTlaLDgzMzI4NTgy0200prEqyH4y/pdf?s=ap",
      "subscription": "sub_1NiEd5CwEGCgBV8c3ON1VNaz"
    }
  }
}
```

Full event data sample.
```json
{
  "id": "evt_1Nid8EEGVCwCgB8O8w96rCvM",
  "object": "event",
  "api_version": "2023-08-16",
  "created": 1692787781,
  "data": {
    "object": {
      "id": "in_1NiCgEd5CwBEGVMCY8ONkwuF",
      "object": "invoice",
      "account_country": "SG",
      "account_name": "thepmftool",
      "account_tax_ids": null,
      "amount_due": 100000,
      "amount_paid": 100000,
      "amount_remaining": 0,
      "amount_shipping": 0,
      "application": null,
      "application_fee_amount": null,
      "attempt_count": 1,
      "attempted": true,
      "auto_advance": false,
      "automatic_tax": {
        "enabled": false,
        "status": null
      },
      "billing_reason": "subscription_create",
      "charge": "ch_3NiEd5CBEGVwCg8O0fW6eFHo",
      "collection_method": "charge_automatically",
      "created": 1692787779,
      "currency": "sgd",
      "custom_fields": null,
      "customer": "cus_OV8zF7RMsBo1K1",
      "customer_address": {
        "city": null,
        "country": "SG",
        "line1": null,
        "line2": null,
        "postal_code": null,
        "state": null
      },
      "customer_email": "test@thepmftool.com",
      "customer_name": "JJ",
      "customer_phone": null,
      "customer_shipping": null,
      "customer_tax_exempt": "none",
      "customer_tax_ids": [],
      "default_payment_method": null,
      "default_source": null,
      "default_tax_rates": [],
      "description": null,
      "discount": null,
      "discounts": [],
      "due_date": null,
      "effective_at": 1692787779,
      "ending_balance": 0,
      "footer": null,
      "from_invoice": null,
      "hosted_invoice_url": "https://invoice.stripe.com/i/acct_1NfigeCwCgBEGV8O/test_YF8xWNjdT2VmZpZDd0NnQkVHVjhPLF9PVkY3U0hPbUZZZFNkRzZhaFJMY0s0TjhadE5qRTlaLDgzMzI4NTgy0200prEqyH4y?s=ap",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_1NfigeCwCgBEGV8O/test_YWNjdF8xTmZ2VDpZd0NnQkVjhVHPLF9PVkY3U0hPbUZZZFNkRzZhaFJMY0s0TjhadE5qRTlaLDgzMzI4NTgy0200prEqyH4y/pdf?s=ap",
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "object": "list",
        "data": [
          {
            "id": "il_1NiEd5CwGV8CgBEOg4WBAutF",
            "object": "line_item",
            "amount": 100000,
            "amount_excluding_tax": 100000,
            "currency": "sgd",
            "description": "1 × Standard (at $1,000.00 / year)",
            "discount_amounts": [],
            "discountable": true,
            "discounts": [],
            "livemode": false,
            "metadata": {},
            "period": {
              "end": 1724410179,
              "start": 1692787779
            },
            "plan": {
              "id": "price_1NhGCgBFQCwEGV8O65i85KaD",
              "object": "plan",
              "active": true,
              "aggregate_usage": null,
              "amount": 100000,
              "amount_decimal": "100000",
              "billing_scheme": "per_unit",
              "created": 1692555672,
              "currency": "sgd",
              "interval": "year",
              "interval_count": 1,
              "livemode": false,
              "metadata": {},
              "nickname": null,
              "product": "prod_OeCUEi9CzKfazn",
              "tiers_mode": null,
              "transform_usage": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "price": {
              "id": "price_1NhGFQCwGV8CgBEOiaD85K65",
              "object": "price",
              "active": true,
              "billing_scheme": "per_unit",
              "created": 1692555672,
              "currency": "sgd",
              "custom_unit_amount": null,
              "livemode": false,
              "lookup_key": "standard-yearly",
              "metadata": {},
              "nickname": null,
              "product": "prod_OeCUEi9CzKfazn",
              "recurring": {
                "aggregate_usage": null,
                "interval": "year",
                "interval_count": 1,
                "trial_period_days": null,
                "usage_type": "licensed"
              },
              "tax_behavior": "unspecified",
              "tiers_mode": null,
              "transform_quantity": null,
              "type": "recurring",
              "unit_amount": 100000,
              "unit_amount_decimal": "100000"
            },
            "proration": false,
            "proration_details": {
              "credited_items": null
            },
            "quantity": 1,
            "subscription": "sub_1NiEd5CwEGCgBV8c3ON1VNaz",
            "subscription_item": "si_OVF7umUnBi9YSY",
            "tax_amounts": [],
            "tax_rates": [],
            "type": "subscription",
            "unit_amount_excluding_tax": "100000"
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/invoices/in_1NiCgEd5CwBEGVMCY8ONkwuF/lines"
      },
      "livemode": false,
      "metadata": {},
      "next_payment_attempt": null,
      "number": "4A5B6339-0001",
      "on_behalf_of": null,
      "paid": true,
      "paid_out_of_band": false,
      "payment_intent": "pi_3NiEd5CwCgBEGV8O0ajKnELb",
      "payment_settings": {
        "default_mandate": null,
        "payment_method_options": null,
        "payment_method_types": null
      },
      "period_end": 1692787779,
      "period_start": 1692787779,
      "post_payment_credit_notes_amount": 0,
      "pre_payment_credit_notes_amount": 0,
      "quote": null,
      "receipt_number": null,
      "rendering_options": null,
      "shipping_cost": null,
      "shipping_details": null,
      "starting_balance": 0,
      "statement_descriptor": null,
      "status": "paid",
      "status_transitions": {
        "finalized_at": 1692787779,
        "marked_uncollectible_at": null,
        "paid_at": 1692787781,
        "voided_at": null
      },
      "subscription": "sub_1NiEd5CwEGCgBV8c3ON1VNaz",
      "subscription_details": {
        "metadata": {}
      },
      "subtotal": 100000,
      "subtotal_excluding_tax": 100000,
      "tax": null,
      "test_clock": null,
      "total": 100000,
      "total_discount_amounts": [],
      "total_excluding_tax": 100000,
      "total_tax_amounts": [],
      "transfer_data": null,
      "webhooks_delivered_at": null
    }
  },
  "livemode": false,
  "pending_webhooks": 2,
  "request": {
    "id": "req_FoK6OZc27ezTCm",
    "idempotency_key": "5ca72bab-7902-44ed-add0-7a8e9871171e"
  },
  "type": "invoice.paid"
}
```