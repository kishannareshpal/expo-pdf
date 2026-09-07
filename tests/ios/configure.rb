require 'xcodeproj'

root = File.expand_path('../..', __dir__)
project_path = File.join(root, 'example/ios/expopdfexample.xcodeproj')
project = Xcodeproj::Project.open(project_path)
app = project.targets.find { |target| target.name == 'expopdfexample' }
tests = project.targets.find { |target| target.name == 'ExpoPdfTests' }
unless tests
  tests = project.new_target(:unit_test_bundle, 'ExpoPdfTests', :ios, '15.1')
  tests.add_dependency(app)
end

Dir[File.join(__dir__, '*.swift')].each do |path|
  next if tests.source_build_phase.files_references.any? { |reference| reference.real_path.to_s == path }
  tests.source_build_phase.add_file_reference(project.main_group.new_file(path))
end

tests.build_configurations.each do |config|
  app_config = app.build_configurations.find { |item| item.name == config.name }
  config.build_settings.merge!({
    'GENERATE_INFOPLIST_FILE' => 'YES',
    'PRODUCT_NAME' => '$(TARGET_NAME)',
    'PRODUCT_BUNDLE_IDENTIFIER' => 'com.kishannareshpal.expopdf.tests',
    'TEST_HOST' => '$(BUILT_PRODUCTS_DIR)/expopdfexample.app/expopdfexample',
    'BUNDLE_LOADER' => '$(TEST_HOST)',
    'SWIFT_VERSION' => app_config.build_settings.fetch('SWIFT_VERSION', '5.0'),
  })
end
project.save

scheme = Xcodeproj::XCScheme.new
scheme.add_build_target(app)
scheme.add_build_target(tests)
scheme.add_test_target(tests)
scheme.set_launch_target(app)
scheme.save_as(project.path, 'ExpoPdfTests', true)

podfile_path = File.join(root, 'example/ios/Podfile')
podfile = File.read(podfile_path)
unless podfile.include?("target 'ExpoPdfTests'")
  anchor = '  post_install do |installer|'
  abort 'Could not find the Expo post_install hook in the generated Podfile' unless podfile.include?(anchor)
  podfile.sub!(anchor, "  target 'ExpoPdfTests' do\n    inherit! :complete\n  end\n\n#{anchor}")
  File.write(podfile_path, podfile)
end
