# Embed inline PDFs in Gitbook

This plugin embeds inline PDFs in a GitBook.

## Features

#### Copy Assets
The plugin will copy all `.pdf` files in `./assets/` to the output directory (at the time of writing, Gitbook doesn't do this natively).

#### PDF Block

This plugin exposes a `{% pdf }` block to embed a pdf into a webpage.

## How to use it

1) Configure the plugin in your `book.json`:

```
{
    "plugins": ["embed-pdf"]
}
```

2) Embed a PDF using the `pdf` block:

```
{% pdf src="/assets/example.pdf", width="100%", height="850" %}{% endpdf %}
```

This would produce the following HTML

```
<div class="pdf">
    <div class="pdf__link">
    	<a target="_blank" href="/assets/example.pdf">View PDF</a>
    </div>
    <object data="/assets/example.pdf" width="100%" height="850" type="application/pdf">
        <embed src="/assets/example.pdf">
            <p>
                This browser does not support PDFs. <br>
                Please download the PDF to view it: <a target="_blank" href="/assets/example.pdf">Download PDF</a>.
            </p>
    </object>
</div>
```

## Options

The `pdf` block takes the following attributes

* `src` : (required) the url to the PDF to embed
* `width` : the width of the object containing the PDF
* `height` : the height of the object containing the PDF
* `link` : (default=true) shows a link to view the PDF in a new browser window/tab