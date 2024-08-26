control 'check-cmd-exists' do
    title 'Check if cmd.exe exists'
    desc 'Ensure that cmd.exe exists in the system32 directory'
  
    describe file('C:/Windows/System32/cmd.exe') do
      it { should exist }
    end
end