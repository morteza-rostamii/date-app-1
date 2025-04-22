<header>
  <h1>Welcome, {{username}}!</h1>
</header>

<main>
  <p class="text-3xl font-bold underline bg-blue-500">Here’s your to-do
    list:22225 ))
  </p>
  <ul>
    {{#each items}}
      <li>{{this}}</li>
    {{/each}}
  </ul>

{{> Button text="Add Item" }}

  <div>
    {{#if isHome }}
      <p>this is a main page</p>
    {{else}}
      <p>this is an admin page</p>
    {{/if}}
  </div>

{{!-- loop --}}

  <ul>
  {{#each users }}
    <li class="flex items-center gap-3">
      <p>{{@index}}</p>
      <p>
      {{this.username}}
      </p>
      <p>
        {{this.address.city}}
      </p>

      {{!-- custom helper --}}
      {{!-- {{#ifEquals role "admin"}}
        <p class="bg-green-400">admin</p>
      {{else}}
        <p class="bg-blue-400">not admin</p>
      {{/ifEquals}} --}}

      {{!-- helper that returns true or false --}}
      {{#if (isAdmin role)}}
        <p class="bg-green-400">admin</p>
      {{else}}
        <p class="bg-blue-400">not admin</p>
      {{/if}}
    </li>

{{/each}}

  </ul>

{{!-- helper that returns text or html --}}
{{{ makeBold "this is a bold text"}}}

{{!-- block partials --}}
{{#> Test title="This is a test" }}
{{#*inline "cardBody"}}

<p>card body</p>
{{/inline}}
{{/Test}}

{{!-- get data in alpine --}}

  <div
  x-data='{
  users: {{json users}}
  }'
  >sd
    <p x-text="users[0].username">f</p>
  </div>
</main>

<footer>
  <p>© 2025 Your App</p>
</footer>

<!-- Test -->
<div class="card bg-yellow-400 p-2">
  <h3>{{title}}</h3>

{{> cardBody }}

</div>
