from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Newsletter  # 👈 Newsletter koodi import cheyyuka

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'stock', 'image_preview')

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return "No Image"

    image_preview.short_description = "Image"

# ─────────────── REGISTER NEWSLETTER ───────────────
@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    # Admin list view-il kanenda fields
    list_display = ('email', 'created_at')
    # Email search cheyyan ulla option
    search_fields = ('email',)
    # Date vechu filter cheyyan
    list_filter = ('created_at',)