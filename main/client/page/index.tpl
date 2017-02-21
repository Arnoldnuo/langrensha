{% extends 'main:page/layout.tpl' %}

{% block customHead %}
    {% script %}
        require('./index.js');
    {% endscript %}
{% endblock %}

{% block content %}
    <div id="app">
        <router-link to="/foo">Go to Foo</router-link>
        <router-view></router-view>
    </div>
{% endblock %}
