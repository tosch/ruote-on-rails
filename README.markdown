Ruote on Rails
==============

A simple example Rails 3 app for demonstrating the usage of
[ruote](http://ruote.rubyforge.org) in [Rails](http://rubyonrails.org) using
[ruote-kit](http://github.com/kennethkalmer/ruote-kit).


Installation
------------

### Use The Rails Template ###

*   install Rails
        $ gem install rails
*   create a new Rails app by running
        $ rails new foo -m http://github.com/tosch/ruote-on-rails/raw/rails3/template.rb
*   cd into the new Rails dir
        $ cd foo
*   make sure all dependencies are met (you'll need to have
    [bundler](http://rubybundler.com) installed)
        $ bundle install

### Or Clone This Repository ###

*   clone (or do whatever you like to get the code) this repo:
        $ git clone git://github.com/tosch/ruote-on-rails.git  
        $ cd ruote-on-rails
*   switch to rails3 branch
        $ git checkout -t origin/rails3
*   make sure all dependencies are met (you'll need to have
    [bundler](http://rubybundler.com) installed)
        $ bundle install
*   create temp dir
        $ mkdir -p mkdir tmp/pids


Configuration
-------------

Just tailor config/initializers/ruote_kit.rb to your needs.


Run
---

In one terminal, start the Rails server itself:
    $ rails server
In another terminal, start the RuoteKit worker process:
    $ rake ruote:run_worker

Browse to http://localhost:3000/_ruote and you'll see there are no running
processes. You could change that using the "Launch process" link ;-)


Using Ruote from within Rails
-----------------------------

You can access Ruote's engine anywhere in your Rails code by calling
    RuoteKit.engine
So launching a workflow process is as easy as
    RuoteKit.engine.launch your_process_definition
The storage participant (used by the catchall participant) is available at
    RuoteKit.storage_participant


Examples
--------

There are a few example apps based on Ruote On Rails:

* [TheBoard](http://github.com/jmettraux/theboard) by
  [John Mettraux](http://github.com/jmettraux) uses Rails 3 and is "a rails3
  example application for ruote / ruote-kit / quaderno"
* [ruote-rails-example](http://github.com/threetee/ruote-rails-example) by
  [threetee](http://github.com/threetee) is a Rails 2 test app which integrates
  ruote, ruote-amqp, ruote-kit and ruote-on-rails