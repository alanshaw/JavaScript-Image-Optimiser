Asked Questions
===============

- Why doesn't JSIO process background images in my stylesheet?

It could be because it isn't hosted on the same domain as your website. Cross domain policy restricts JSIO from reading style rules. To get round this, you can use the CSS `@import` statement to get your stylesheets:

```html
<style>
@import url("http://your-cross-domain/stylesheet.css")
</style>
```