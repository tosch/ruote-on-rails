
#
# Simply opening the ruote workitem class to add some things specific
# to arts (and ActiveModel).
#
class Ruote::Workitem

  #include ActiveModel::Naming
  #include ActiveModel::Validations

  def task
    params['task']
  end

  def participant_name=(name)
    @h['participant_name'] = name
  end

  def self.for_user(username)

    user = User.find(username)

    return RuoteKit.engine.storage_participant.all if user.admin?

    # note : ruote 2.1.12 should make it possible to write
    #
    #   RuoteKit.engine.storage_participant.by_participant(
    #     [ username, user.groups, 'anyone' ].flatten)
    #
    # directly.

    [ username, user.groups, 'anyone' ].flatten.collect { |pname|
      RuoteKit.engine.storage_participant.by_participant(pname)
    }.flatten
  end

  #--
  # active model (method need to make of workitems active models)
  #++

#  def self.model_name
#
#    return @_model_name if @_model_name
#
#    mn = Object.new
#    def mn.name; 'workitem'; end
#    @_model_name = ActiveModel::Name.new(mn)
#  end
#
#  def to_model
#    self
#  end
#
#  def destroyed?
#    fields['_destroyed'] == true
#  end
#
#  def new_record?
#    @h['fei'] == {}
#  end
#
#  def persisted?
#    @h['fei'] != {}
#  end
#
#  def to_key
#    return nil unless persisted?
#    [ @h['_id'] ]
#  end

  def to_param
    fei.sid
  end
end

