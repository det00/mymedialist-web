import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <script src="/vendor/jquery/jquery.min.js"></script>
          <script src="/vendor/bootstrap/js/bootstrap.min.js"></script>
          <script src="/assets/js/isotope.min.js"></script>
          <script src="/assets/js/owl-carousel.js"></script>
          <script src="/assets/js/tabs.js"></script>
          <script src="/assets/js/popup.js"></script>
          <script src="/assets/js/custom.js"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;