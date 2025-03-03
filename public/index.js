// This script checks if we're on the root domain and redirects to the React app
if (
  window.location.pathname === "/" &&
  !window.location.search.includes("react=true")
) {
  // Check if we're on the home page without any query parameters
  window.location.href = "/home";
}
