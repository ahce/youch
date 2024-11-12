function showFormattedFrames(button) {
  const parent = button.closest('section')

  const formattedFrames = parent.querySelector('#stack-frames-formatted')
  formattedFrames.classList.add('visible')

  const rawFrames = parent.querySelector('#stack-frames-raw')
  rawFrames.classList.remove('visible')

  button.parentElement.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'))
  button.classList.add('active')
}

function showRawFrames(button) {
  const parent = button.closest('section')

  const formattedFrames = parent.querySelector('#stack-frames-formatted')
  formattedFrames.classList.remove('visible')

  const rawFrames = parent.querySelector('#stack-frames-raw')
  rawFrames.classList.add('visible')

  button.parentElement.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'))
  button.classList.add('active')
}

function toggleFrameSource(event, parentId) {
  if (event.target.tagName === 'A') {
    return
  }

  const frame = document.querySelector(`#${parentId}`)
  if (!frame) {
    return
  }

  if (frame.classList.contains('expanded')) {
    frame.classList.remove('expanded')
  } else {
    frame.classList.add('expanded')
  }
}
