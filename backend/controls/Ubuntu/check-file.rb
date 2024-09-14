control 'ssh-protocol' do
  title 'Check SSH Protocol'
  desc 'Ensure SSH Protocol is set to version 2'

  describe sshd_config do
    its('Protocol') { should cmp '2' }
  end
end


control 'check-passwd-permissions' do
  title 'Check /etc/passwd file permissions'
  desc 'Ensure /etc/passwd file has correct permissions'

  describe file('/etc/passwd') do
    it { should exist }
    its('mode') { should cmp '0644' }
  end
end


control 'apache-service' do
  title 'Check Apache2 Service'
  desc 'Ensure Apache2 service is running and enabled'

  describe service('apache2') do
    it { should be_installed }
    it { should be_enabled }
    it { should be_running }
  end
end


control 'check-system-updates' do
  title 'Check for system security updates'
  desc 'Ensure system is up to date with security patches'

  describe command('apt list --upgradable | grep -i security') do
    its('stdout') { should eq '' }
  end
end

control 'check-disk-usage' do
  title 'Check disk space usage'
  desc 'Ensure root partition has at least 10% free space'

  describe filesystem('/') do
    its('percent_free') { should be >= 10 }
  end
end

control 'open-ports' do
  title 'Check open ports'
  desc 'Ensure that only allowed ports are open'

  describe port(22) do
    it { should be_listening }
  end

  describe port(80) do
    it { should_not be_listening }
  end
end

control 'unauthorized-users' do
  title 'Check for unauthorized users'
  desc 'Ensure no unauthorized users exist on the system'

  describe passwd do
    its('users') { should_not include 'unauthorized_user' }
  end
end

control 'swap-disabled' do
  title 'Ensure swap is disabled'
  desc 'Check that the swap is disabled for performance'

  describe command('swapon --summary') do
    its('stdout') { should eq '' }
  end
end

control 'ip-forwarding' do
  title 'Check if IP forwarding is disabled'
  desc 'Ensure kernel parameter for IP forwarding is set to 0'

  describe kernel_parameter('net.ipv4.ip_forward') do
    its('value') { should eq 0 }
  end
end

control 'nginx-installed' do
  title 'Check if NGINX is installed'
  desc 'Ensure that the NGINX package is installed'

  describe package('nginx') do
    it { should be_installed }
  end
end
