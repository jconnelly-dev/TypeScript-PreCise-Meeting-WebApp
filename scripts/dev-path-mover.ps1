##########
#
# dev-path-mover.ps1
# author: Joseph Connelly
# description: 
#	This PowerShell script inserts one or more desired paths into 
#	 the System or User PATH environment variable just before an 
#	 existing target path, removing duplicates if necessary.
#
##########

##
# Define the desired paths we want to increase in priority above target path.
#
$targetPath = "C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.0\"
$desiredPaths = @(
    "C:\Users\jconnelly\AppData\Roaming\npm",
    "C:\Users\jconnelly\AppData\Roaming\npm\tsc"
)

##
# Get current PATH environment variables.
#	System PATH = "Machine", User PATH = "User"
#
$targetScope = "Machine"
$currentPath = [Environment]::GetEnvironmentVariable("Path", $targetScope) -split ';'

##
# Remove any existing instance of the desired paths first, to avoid later duplicates.
#
$currentPath = $currentPath | Where-Object { $desiredPaths -notcontains $_ }

##
# Find index of existing target path.
#	Then insert desired paths before target index, or beginning.
#
$insertIndex = $currentPath.IndexOf($targetPath)
if ($insertIndex -eq -1)
{
    Write-Host "WARNING: '$targetPath' not found in PATH. Adding new paths to the beginning."
    $currentPath = $desiredPaths + $currentPath
}
else
{
	Write-Host "FOUND: '$targetPath' found in PATH. Adding new paths before target."
    $currentPath = $currentPath[0..($insertIndex - 1)] + $desiredPaths + $currentPath[$insertIndex..($currentPath.Length - 1)]
}

##
# Create updated PATH string and apply it.
#
$newPath = ($currentPath -join ';').TrimEnd(';')
[Environment]::SetEnvironmentVariable("Path", $newPath, $targetScope)
Write-Host "SUCCESS: Updated $targetScope PATH with desired paths inserted before '$insertBeforePath'."
Write-Host "VERIFICATION: Updated $targetScope PATH ---> newPath='$newPath'"