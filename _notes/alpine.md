<!--
You can nest Alpine components without variables colliding.



 -->

  <div
    x-data="{
  users: {{json users}}
  }"
  >sd
    <p x-text="users[0].username">f</p>
  </div>

  <!-- @click="window.alert('hello')"-->
  <div x-data="{ open: false }">
    {{! onclick }}
    <button class="bg-red-400 p-2 rounded-md" @click="open = !open">
      toggle
    </button>

    <div
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0 -translate-y-4"
      x-transition:enter-end="opacity-100 translate-y-0"
      x-transition:leave="transition ease-in duration-200"
      x-transition:leave-start="opacity-100 translate-y-0"
      x-transition:leave-end="opacity-0 -translate-y-4"
      x-show="open"
    >
      this is a message
    </div>

  </div>

{{! two ways data binding: state to input }}

  <div x-data="Form()">
    <label class="block mb-2">Your Name:</label>
    <input type="text" x-model="form.name" placeholder="Enter your name" />

    {{! <span x-text="form.name || 'No name'"></span> }}

    {{! django data in alpine }}
    <span x-text="form.name || '{{username}}'"></span>

  </div>
  <script type="text/javascript" defer>
    function Form() { return { form: { name: '', }, init(){}, } }
  </script>

{{! loading }}

  <div x-data="{ loading: false}">
    <button
      @click="() => { loading = true; setTimeout(() => { loading = false }, 2000)}"
      :disabled="loading"
    >
      <span x-text="loading ? 'Loading...' : 'Click Me'"></span>

    </button>

  </div>

{{! loop }}

  <div x-data="{ users: {{json users}} }">
    <ul>
      <template x-for="(user, index) in users" :key="index">
        <li x-text="user.username" x-text="user.username"></li>
      </template>
    </ul>
  </div>

{{!-- {{> Card }} --}}

{{! effect }}

  <div
    x-data="{count: 0}"
    x-init="$watch('count', value => console.log(`count is now ${value}`))"
  >
    <button @click="count++">Increment</button>

    <p x-text="count"></p>

    {{! any state changes }}
    <div x-effect="console.log(`any value changes ${count}`)"></div>

  </div>

<!-- fetch data -->

<div x-data="loadUsers()" x-init="fetchUsers()">
  <template x-if="loading">
    <p>Loading...</p>
  </template>

  <template x-if="error">
    <p class="text-red-600">Error: <span x-text="error"></span></p>
  </template>

  <ul>
    <template x-for="user in users" :key="user.id">
      <li x-text="user.name"></li>
    </template>
  </ul>
</div>

<script>
  function loadUsers() {
    return {
      users: [],
      loading: true,
      error: null,
      fetchUsers() {
        fetch('/api/users')
          .then(res => {
            if (!res.ok) throw new Error('Something went wrong')
            return res.json()
          })
          .then(data => {
            this.users = data
            this.loading = false
          })
          .catch(err => {
            this.error = err.message
            this.loading = false
          })
      }
    }
  }
</script>

<!-- global state --->
  <div x-data>
    <button @click="$store.global.generateRandomNum()">generate random</button>
    <span x-text="$store.global.randomNum"></span>
  </div>

<script type="text/javascript" defer>
      document.addEventListener('alpine:init', () => {
        Alpine.store('global', {
          randomNum: 0,

          generateRandomNum() {
            this.randomNum = Math.floor(Math.random() * 100)
          }
        })
      })
    </script>

<!-- form validation -->
<form x-data="{ name: '', _csrf: '{{csrfToken}}' }" @submit.prevent="submit">
  <input type="hidden" x-model="_csrf" name="_csrf" />
  <input type="text" x-model="name" />
  <button>Submit</button>
</form>
