function toggleTheme(input) {
  if (input.checked) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('youch-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('youch-theme', 'light')
  }
}
