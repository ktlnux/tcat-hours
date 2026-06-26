<template>
  <div class="fb-wrap">
    <button class="fb-trigger" @click="open = true">
      <i class="ti ti-message-circle"></i>
      Send feedback to the developer
    </button>

    <Teleport to="body">
      <div v-if="open" class="fb-overlay" @click.self="closeIfIdle">
        <div class="fb-modal" role="dialog" aria-modal="true">
          <div class="fb-head">
            <span class="fb-title">Send feedback</span>
            <button class="fb-close" @click="closeIfIdle" aria-label="Close">
              <i class="ti ti-x"></i>
            </button>
          </div>

          <div v-if="status === 'success'" class="fb-success">
            <i class="ti ti-circle-check fb-success-icon"></i>
            <p>Feedback sent — thank you!</p>
          </div>

          <form v-else @submit.prevent="submit" novalidate>
            <div class="fb-field">
              <label class="fb-lbl" for="fb-name">Name <span class="fb-opt">(optional)</span></label>
              <input
                id="fb-name"
                v-model="name"
                class="fb-input"
                type="text"
                placeholder="Your name"
                :disabled="status === 'loading'"
                autocomplete="name"
              />
            </div>

            <div class="fb-field">
              <label class="fb-lbl" for="fb-msg">Message <span class="fb-req">*</span></label>
              <textarea
                id="fb-msg"
                v-model="message"
                class="fb-textarea"
                placeholder="What's on your mind?"
                rows="5"
                :disabled="status === 'loading'"
                required
              ></textarea>
              <p v-if="showError" class="fb-err">A message is required.</p>
            </div>

            <div v-if="status === 'error'" class="fb-errbanner">
              <i class="ti ti-alert-circle"></i>
              Failed to send feedback. Please try again.
            </div>

            <div class="fb-actions">
              <button type="button" class="fb-cancel" @click="closeIfIdle" :disabled="status === 'loading'">
                Cancel
              </button>
              <button type="submit" class="fb-submit" :disabled="status === 'loading'">
                <i v-if="status === 'loading'" class="ti ti-loader-2 fb-spin"></i>
                <span>{{ status === 'loading' ? 'Sending…' : 'Send feedback' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const GH_TOKEN = import.meta.env.VITE_GH_TOKEN
const GH_OWNER = import.meta.env.VITE_GH_OWNER
const GH_REPO  = import.meta.env.VITE_GH_REPO
const API_BASE = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/feedback.txt`

const open      = ref(false)
const name      = ref('')
const message   = ref('')
const status    = ref('idle') // idle | loading | success | error
const showError = ref(false)

function reset() {
  name.value      = ''
  message.value   = ''
  status.value    = 'idle'
  showError.value = false
}

function closeIfIdle() {
  if (status.value === 'loading') return
  open.value = false
  reset()
}

function timestamp() {
  return new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }) + ' EST'
}

function buildEntry(currentText) {
  const separator = currentText && !currentText.endsWith('\n\n') ? '\n' : ''
  const nameLine = name.value.trim() ? `Name: ${name.value.trim()}\n` : ''
  return `${currentText}${separator}[${timestamp()}]\n${nameLine}Message: ${message.value.trim()}\n\n`
}

async function submit() {
  if (!message.value.trim()) {
    showError.value = true
    return
  }
  showError.value = false
  status.value = 'loading'

  try {
    const headers = {
      Authorization: `Bearer ${GH_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json'
    }

    // Fetch current file to get SHA (required for updates) and existing content
    let sha = null
    let existing = ''
    const res = await fetch(API_BASE, { headers })
    if (res.ok) {
      const data = await res.json()
      sha = data.sha
      existing = atob(data.content.replace(/\n/g, ''))
    } else if (res.status !== 404) {
      throw new Error(`Unexpected status ${res.status}`)
    }

    const newContent = buildEntry(existing)

    const body = {
      message: 'Add feedback entry',
      content: btoa(unescape(encodeURIComponent(newContent))),
      ...(sha ? { sha } : {})
    }

    const putRes = await fetch(API_BASE, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    })

    if (!putRes.ok) throw new Error(`Write failed: ${putRes.status}`)

    status.value = 'success'
    setTimeout(() => {
      open.value = false
      reset()
    }, 2000)
  } catch {
    status.value = 'error'
  }
}
</script>
