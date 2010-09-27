Ruote on Rails
==============

A simple example Rails app for demonstrating the usage of
[ruote](http://ruote.rubyforge.org) in [Rails](http://rubyonrails.org) using
[RuoteKit](http://github.com/kennethkalmer/ruote-kit).


Installation
------------

Sorry, it's a bit complicated unless you decide to use Bundler[http://gembundler.org]
for gem handling. It'll get easier soon when ruote and ruote-kit v2.1.11 will be
released.

*   build the ruote gem from the sources and install it
        $ git clone git://github.com/jmettraux/ruote.git && cd ruote
        $ gem install jeweler
        $ rake build && gem install pkg/ruote-2.1.11.gem && cd ..
*   build the ruote-kit gem from the sources and install it
        $ git clone git://github.com/kennethkalmer/ruote-kit.git && cd ruote-kit
        $ gem install bundler
        $ bundle install
        $ rake build && gem install pkk/ruote-kit-2.1.11.gem && cd ..
*   clone (or do whatever you like to get the code) this repo:
        $ git clone git://github.com/tosch/ruote-on-rails.git  
        $ cd ruote-on-rails
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

This is a TODO