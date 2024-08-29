control 'check-cmd-exists' do
    title 'Check if cmd.exe exists'
    desc 'Ensure that cmd.exe exists in the system32 directory'

    describe file('file') do
      it { should exist }
    end
end

control 'file 2 exists or not' do
  title 'Check if file 2 exists'
  desc 'Ensure that file 2 exists in the directory'

  describe file('wow') do
    it { should exist }
  end
end

control 'file2 exists or not' do
  title 'Check if file2 doesnt exist exists'
  desc 'Ensure that file2 doesnt exists in the directory'

  describe file('file2') do
    it { should_not exist }
  end
end

control 'file2 exists or not' do
  title 'Check if file2 doesnt exist exists'
  desc 'Ensure that file2 doesnt exists in the directory'

  describe file('file3') do
    it { should exist }
  end
end