var Logo = Logo || {};
(function(d, f, g, h) {
    Logo.LoginLogo = {
        config: { version: "1.5.1", nonce: null, editor: null, selectedId: 0 },
        elems: { $container: ".custom-login-logo", $uploadTrigger: ".upload-image", $uploadInput: "#upload-input", $nonceInput: "#custom_login_logo_nonce", $updateStatus: ".update-status", $imgHolder: ".img-holder", $imgPreview: ".img-preview" },
        init: function() {
            Logo.Tools.setElems(this.elems, this);
            if (Logo.Tools.doesElemExist(this.elems.$container)) {
                _.bindAll(this, "setEditor", "setNonce", "getOptions", "updateOptions", "showImagePreview",
                    "preSelectImage", "catchInsert");
                this.setNonce();
                this.setEditor();
                this.getOptions();
                this.catchInsert();
                var a = this;
                this.elems.$uploadTrigger.on("click", function() { a.config.editor.open(); return !1 });
                this.config.editor.on("open", this.preSelectImage)
            }
        },
        setEditor: function() { this.config.editor = wp.media.editor.add("content") },
        setNonce: function() { this.config.nonce = this.elems.$nonceInput.val() },
        getOptions: function() {
            var a = this;
            d.ajax({
                url: ajaxurl,
                type: "post",
                dataType: "json",
                data: {
                    action: "displayPreviewImg",
                    custom_login_logo_nonce: this.config.nonce
                }
            }).done(function(b) { a.showImagePreview(b) })
        },
        updateOptions: function(a, b) { var c = this;
            d.ajax({ url: ajaxurl, type: "post", dataType: "json", data: { action: "getImageData", id: a, size: b, custom_login_logo_nonce: this.config.nonce } }).done(function(a) { c.showImagePreview(a);
                c.elems.$updateStatus.show() }) },
        showImagePreview: function(a) { this.elems.$uploadInput.val(a.src);
            this.elems.$imgPreview.html('<img src="' + a.src + '" />');
            this.elems.$imgHolder.show();
            this.config.selectedId = a.id },
        preSelectImage: function() { var a = this.config.editor.state().get("selection"),
                b = wp.media.attachment(this.config.selectedId);
            b.fetch();
            a.add(b ? [b] : []) },
        catchInsert: function() { var a = this;
            wp.media.editor.send.attachment = function(b, c) { a.updateOptions(c.id, b.size) } }
    };
    Logo.Tools = { setElems: function(a, b, c) { b.elems = b.elems || {}; for (var e in a) b.elems[e] = c ? c.find(a[e]) : d(a[e]) }, doesElemExist: function(a) { return "undefined" !== typeof a && a.length } };
    d(function() { Logo.LoginLogo.init() })
})(jQuery, window, document);