control 'file 2 exists or not' do
    title 'Check if file 2 exists'
    desc 'Ensure that file 2 exists in the directory'
  
    describe file('wow') do
      it { should exist }
    end
  end
  