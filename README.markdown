Ruote on Rails
==============

A simple example Rails app for demonstrating the usage of
[ruote](http://ruote.rubyforge.org) in [Rails](http://rubyonrails.org) using
[RuoteKit](http://github.com/kennethkalmer/ruote-kit).

This is the (legagy) branch for Rails 2. There is a rails3 branch available.


Installation
------------

*   clone (or do whatever you like to get the code) this repo:
        $ git clone git://github.com/tosch/ruote-on-rails.git  
        $ cd ruote-on-rails
*   checkout the rails2 branch
        $ git checkout -t rails2
*   install any missing gems
        $ rake gems:install


Configuration
-------------

Just tailor config/initializers/ruote_kit.rb to your needs.


Run
---

In one terminal, start the Rails server itself:
    $ script/server
In another terminal, start the ruote worker process:
    $ rake ruote:run_worker

Browse to http://localhost:3000/_ruote and you'll see there are no running
processes. You could change that using the "Launch process" link ;-)


Using ruote from within Rails
-----------------------------

You can access ruote's engine anywhere in your Rails code by calling
    RuoteKit.engine
So launching a workflow process is as easy as
    RuoteKit.engine.launch your_process_definition
The storage participant (used by the catchall participant) is available at
    RuoteKit.storage_participant


Examples
--------

* [ruote-rails-example](http://github.com/threetee/ruote-rails-example) by
  [threetee](http://github.com/threetee) is a Rails 2 test app which integrates
  ruote, ruote-amqp, ruote-kit and ruote-on-rails
* the rails3 branch of route-on-rails includes the TheBoard example by
  [John Mettraux](http://github.com/jmettraux), which is "a rails3 example
  application for ruote / ruote-kit / quaderno"
