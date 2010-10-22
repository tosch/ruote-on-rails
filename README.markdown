Ruote on Rails
==============

Is an example Rails 3 app for demonstrating the usage of
[ruote](http://ruote.rubyforge.org) in [Rails](http://rubyonrails.org) via
[ruote-kit](http://github.com/kennethkalmer/ruote-kit) and
[quaderno](http://github.com/jmettraux/quaderno).

Installation
------------

*   clone (or do whatever you like to get the code) this repo:
        $ git clone git://github.com/tosch/ruote-on-rails.git  
        $ cd ruote-on-rails
*   install [bundler](http://rubybundler.com) if not present
        $ gem install bundler
*   make sure all dependencies are met
        $ bundle install
*   create database
        $ rake db:migrate
*   create temp dir
        $ mkdir -p mkdir tmp/pids


Generate a new Rails app using ruote[-kit]
------------------------------------------

[See ruote-kit's Readme on that](http://github.com/tosch/ruote-kit/blob/master/README.rdoc)

Note: You'll get a plain ruote[-kit] integration, no examples will be installed
to your app. You won't get [quaderno](http://github.com/jmettraux/quaderno) this
way, either.


Configuration
-------------

Just tailor config/initializers/ruote_kit.rb to your needs.


Run
---

    $ rails server

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


Ruote Workers
-------------

When using ruote, you'll often here the words 'engine', 'storage' and 'worker'.
Those are different parts of ruote. Basically, the engine is just a dashboard to
the storage, you use it to launch processes or get the state of running
processes. The engine itself doesn't do any work (triggering participants for
example), it just puts messages into the storage. The work is done by one (or
more) workers (oh yes, that was obvious). They look into the storage to find out
what to do next.

You may instanciate a ruote engine with or without a worker. In the latter case,
you may launch processes, but they will never appear in the processes list
until you start a worker: The launch request will be put in the storage and lie
there unprocessed.

By default, RuoteOnRails does include a worker in the engine when running the
Rails server process. That way, you'll get started quickly. Please beware that
you'll have to be careful when deploying to production. Ruote's worker thread
should be always on, or schedules like timeouts won't be triggered in time (they
won't be forgotten, the next time the worker starts they'll be triggered, but
that may be too late). Especially [Passenger](http://modrails.com) stops Rails
server processes after some time by default and would thus stop the ruote
worker, too (in Passenger 3, you may configure that there should be at least one
process running all the time, though).

RuoteOnRails ships with a rake task that starts a worker and keeps running until
you stop the task. You may launch it by calling

    $ rake ruote:run_worker

Stop the task by pressing Ctrl+C.

If you don't like to have a worker thread running inside your Rails server
process, have a look at config/initializers/ruote-kit.rb. You'll find
instructions there how to instanciate the ruote engine together without a
worker.


TheBoard example
----------------

The auth is minimal (I'd say: pathetic), but see yourself. Please make sure to
replace it with your own if you base your work on this…

TODO: Write more about TheBoard


Other Examples
--------

* [ruote-rails-example](http://github.com/threetee/ruote-rails-example) by
  [threetee](http://github.com/threetee) is a Rails 2 test app which integrates
  ruote, ruote-amqp, ruote-kit and ruote-on-rails


Links
-----

* [ruote](http://ruote.rubyforge.org)
* [ruote-kit](http://github.com/tosch/ruote-kit)
* [quaderno](http://github.com/jmettraux/quaderno) - ([presentation blog](http://jmettraux.wordpress.com/2010/09/22/quaderno/))


License
-------

MIT


Authors
-------

John Mettraux
Torsten Schönebaum