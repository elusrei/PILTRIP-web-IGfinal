// Add active class to current navigation item
document.addEventListener("DOMContentLoaded", () => {
    // Get current page path
    const currentPath = window.location.pathname
  
    // Find all nav links
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link")
  
    // Loop through links and add active class to the matching one
    navLinks.forEach((link) => {
      const linkPath = link.getAttribute("href")
      if (currentPath.includes(linkPath) && linkPath !== "#" && linkPath !== "") {
        link.classList.add("active")
      }
    })
  })
  
  