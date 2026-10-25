# Linux & Networking Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets modern Linux (kernel 5.x to 6.x, systemd-based distributions such as Ubuntu 22.04/24.04, Debian 12, RHEL/Rocky/Alma 9) and the standard TCP/IP stack (IPv4, IPv6, TLS 1.2/1.3, HTTP/1.1, HTTP/2, HTTP/3 over QUIC). Command flags can differ slightly between distributions and versions; verify with `man <command>` or `<command> --help`. Examples use the sample name **Ritesh Kumar**.
> This file covers the shell, files and permissions, processes, memory, storage, users, services, logs, performance tuning, containers and namespaces, and the networking stack from the OSI model to DNS, TCP, TLS, HTTP, load balancing, firewalls and troubleshooting. Use only on systems you own or are authorized to test.

## 📑 Index
- [Part 1: Fresher (0–1 year)](#-part-1-fresher-01-year)
- [Part 2: Junior (1–3 years)](#-part-2-junior-13-years)
- [Part 3: Mid (3–5 years)](#-part-3-mid-35-years)
- [Part 4: Senior (5–7 years)](#-part-4-senior-57-years)
- [Part 5: Lead / Architect (7+ years)](#-part-5-lead--architect-7-years)
- [Part 6: Hands-On Tasks & Scripts](#-part-6-hands-on-tasks--scripts)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky Questions](#-part-8-tricky-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Linux + Networking + Mixed)](#-part-11-complete-coverage-linux--networking--mixed)
- [Part 12: Kernel and Stack Internals](#-part-12-kernel-and-stack-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Linux? Is it an operating system?
Strictly, **Linux is a kernel** (created by Linus Torvalds in 1991). A full operating system, called a **distribution** (Ubuntu, Debian, Fedora, RHEL, Arch, Alpine), combines the kernel with GNU tools, a package manager, an init system and a desktop or server software. Linux is open source (GPL), runs most servers, cloud workloads, Android, containers and embedded devices.

### Q2. What is the difference between Linux and Unix?
Unix is the original family (AT&T, BSD, macOS is certified Unix). Linux is a Unix-**like** kernel written from scratch. Both follow similar ideas: everything is a file, small tools that do one thing, pipes, and a multi-user permission model. Linux is free and open; commercial Unix systems (AIX, Solaris, HP-UX) are mostly proprietary.

### Q3. What is the kernel? What does it do?
The core part of the OS that runs in privileged mode. It manages: CPU scheduling, memory (virtual memory, paging), devices (drivers), file systems, networking, and security. User programs talk to the kernel through **system calls** (`open`, `read`, `write`, `fork`, `execve`, `socket`).

### Q4. What is a shell? Common shells
A program that reads commands and runs them. `bash` (most common), `sh` (POSIX), `zsh`, `fish`, `dash` (fast `/bin/sh` on Debian/Ubuntu). Check yours: `echo $SHELL`. Scripts begin with a shebang: `#!/bin/bash`.

### Q5. Filesystem hierarchy: important directories *(Must-know)*
| Path | Purpose |
|---|---|
| `/` | root of the tree |
| `/bin`, `/usr/bin` | user commands |
| `/sbin`, `/usr/sbin` | admin commands |
| `/etc` | system configuration |
| `/home` | user home directories |
| `/root` | root user's home |
| `/var` | variable data: logs (`/var/log`), spool, caches |
| `/tmp` | temporary files (cleared on reboot or by policy) |
| `/usr` | installed software and libraries |
| `/opt` | optional third-party software |
| `/dev` | device files |
| `/proc` | virtual files exposing process and kernel info |
| `/sys` | kernel and device attributes (sysfs) |
| `/boot` | kernel, initramfs, bootloader |
| `/mnt`, `/media` | mount points |
| `/lib`, `/lib64` | shared libraries |

### Q6. Basic navigation and file commands
```bash
pwd                    # print working directory
ls -lah                # long list, hidden files, human-readable sizes
cd /var/log            # change directory (cd - goes back, cd ~ goes home)
mkdir -p a/b/c         # create nested directories
touch file.txt         # create empty file or update timestamp
cp -r src dst          # copy recursively
mv old new             # move or rename
rm -r dir              # remove recursively (no recycle bin!)
cat file | less        # view
head -n 20 f ; tail -n 20 f ; tail -f f   # first/last lines, follow
```

### Q7. Absolute vs relative paths
Absolute starts at `/` (`/etc/hosts`). Relative depends on the current directory (`../logs/app.log`). `.` is the current directory, `..` is the parent, `~` is the home directory.

### Q8. File permissions *(Must-know)*
Each file has an owner, a group and "others". Each can have `r` (read, 4), `w` (write, 2), `x` (execute, 1).
```bash
ls -l script.sh
# -rwxr-xr-- 1 ritesh devs 120 Oct 24 10:00 script.sh
#  ^ ^^^ ^^^ ^^^
#  | |   |   others: r--
#  | |   group: r-x
#  | owner: rwx
#  type (- file, d directory, l symlink)
chmod 755 script.sh        # rwxr-xr-x
chmod u+x,g-w file         # symbolic mode
chown ritesh:devs file
```
For **directories**: `r` lists names, `w` creates/deletes entries, `x` allows entering (traversing).

### Q9. Special permissions: setuid, setgid, sticky bit
- **setuid (4xxx)**: executable runs with the file owner's privileges (`/usr/bin/passwd`).
- **setgid (2xxx)**: runs as the file's group; on directories new files inherit the group.
- **sticky bit (1xxx)**: on a directory, only the file owner (or root) can delete files in it (`/tmp`).
```bash
chmod 4755 prog ; chmod 2775 shared ; chmod 1777 /tmp
```

### Q10. What is umask?
Default permission mask subtracted from `666` (files) and `777` (directories). `umask 022` gives files `644` and directories `755`. `umask 077` gives private files.

### Q11. Users and groups
```bash
whoami ; id                      # current user, uid, gids
sudo useradd -m -s /bin/bash ritesh
sudo passwd ritesh
sudo usermod -aG docker ritesh   # -a append (without it you REPLACE groups!)
sudo userdel -r ritesh
```
Files: `/etc/passwd` (accounts), `/etc/shadow` (password hashes, root-only), `/etc/group`. UID 0 is root.

### Q12. `sudo` vs `su`
`su - user` switches user (asks for **that user's** password). `sudo cmd` runs one command as another user (usually root) after authenticating **you**, with rules in `/etc/sudoers` (edit with `visudo`). Prefer sudo for auditing and least privilege.

### Q13. Viewing and searching text
```bash
grep -rn "error" /var/log/app/       # recursive, line numbers
grep -i -E "warn|fail" app.log       # case-insensitive, extended regex
grep -v "DEBUG" app.log              # invert match
find /var -name "*.log" -mtime -1    # modified in last day
find . -type f -size +100M           # big files
wc -l file ; sort file | uniq -c | sort -nr | head
cut -d: -f1 /etc/passwd ; awk -F: '{print $1,$3}' /etc/passwd
sed -i 's/foo/bar/g' file            # in-place replace
```

### Q14. Pipes and redirection *(Must-know)*
```bash
cmd > out.txt          # stdout to file (overwrite)
cmd >> out.txt         # append
cmd 2> err.txt         # stderr to file
cmd > all.txt 2>&1     # both to file (order matters)
cmd &> all.txt         # bash shorthand
cmd1 | cmd2            # stdout of cmd1 -> stdin of cmd2
cmd < input.txt        # stdin from file
cmd > /dev/null 2>&1   # discard all output
```
File descriptors: 0 stdin, 1 stdout, 2 stderr.

### Q15. Hard links vs symbolic links
- **Hard link**: another name for the same inode. Same filesystem only; file data survives until all links are removed. Cannot link directories.
- **Symlink (soft link)**: a small file containing a path. Can cross filesystems and point to directories; breaks if the target moves.
```bash
ln file hard ; ln -s /path/target link ; ls -li
```

### Q16. What is an inode?
A data structure storing a file's metadata (owner, permissions, size, timestamps, block locations) but **not its name**. Directory entries map names to inode numbers. A filesystem can run out of inodes (`df -i`) even with free space.

### Q17. Processes: viewing and basic control
```bash
ps aux                  # all processes (BSD style)
ps -ef --forest         # tree view
top ; htop              # live view
pgrep -fa nginx
kill 1234               # SIGTERM (graceful)
kill -9 1234            # SIGKILL (cannot be caught)
pkill -f myapp
jobs ; bg ; fg ; cmd &  # shell job control
nohup cmd &             # keep running after logout
```

### Q18. Common signals
| Signal | Number | Meaning |
|---|---|---|
| SIGHUP | 1 | terminal closed; many daemons reload config |
| SIGINT | 2 | Ctrl+C |
| SIGQUIT | 3 | Ctrl+\ (core dump) |
| SIGKILL | 9 | force kill, cannot be caught |
| SIGTERM | 15 | polite termination (default for `kill`) |
| SIGSTOP / SIGCONT | 19 / 18 | pause / resume (STOP cannot be caught) |
| SIGUSR1/2 | 10/12 | user defined |
| SIGSEGV | 11 | invalid memory access |

### Q19. Package management
| Family | Tool | Examples |
|---|---|---|
| Debian/Ubuntu | `apt`, `dpkg` | `sudo apt update && sudo apt install nginx` |
| RHEL/Fedora | `dnf`/`yum`, `rpm` | `sudo dnf install nginx` |
| Alpine | `apk` | `apk add curl` |
| Arch | `pacman` | `pacman -S nginx` |
Always `update` the index before installing; use `apt list --upgradable`, `apt remove` vs `purge` (purge removes config).

### Q20. Environment variables and PATH
```bash
export APP_ENV=prod          # for this shell and children
echo $PATH                   # directories searched for commands
printenv | sort
```
Persist in `~/.bashrc` / `~/.profile` (user) or `/etc/environment` (system). `which cmd` and `type cmd` show what will run.

### Q21. Basic networking commands
```bash
ip addr                    # IP addresses (replaces ifconfig)
ip route                   # routing table
ping -c 4 8.8.8.8          # ICMP reachability
traceroute example.com     # path (or tracepath, mtr)
curl -I https://example.com
nslookup example.com ; dig example.com
ss -tulpn                  # listening sockets (replaces netstat)
hostname -I
```

### Q22. What is an IP address? Public vs private
IPv4: 32-bit, written `192.168.1.10`. IPv6: 128-bit, written `2001:db8::1`. Private IPv4 ranges (RFC 1918): `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`. Others: loopback `127.0.0.1`, link-local `169.254.0.0/16`. NAT lets many private hosts share one public IP.

### Q23. What is a subnet mask / CIDR?
CIDR `192.168.1.0/24` means the first 24 bits are the network, the last 8 bits identify hosts: 256 addresses, 254 usable (network and broadcast excluded). `/16` = 65,536 addresses, `/30` = 4 addresses (2 usable).

### Q24. What is the OSI model? *(Must-know)*
| # | Layer | Examples |
|---|---|---|
| 7 | Application | HTTP, DNS, SMTP, SSH |
| 6 | Presentation | TLS encryption, encoding |
| 5 | Session | sessions, RPC |
| 4 | Transport | TCP, UDP |
| 3 | Network | IP, ICMP, routers |
| 2 | Data link | Ethernet, Wi-Fi, MAC, switches |
| 1 | Physical | cables, signals |
Mnemonic: "Please Do Not Throw Sausage Pizza Away".

### Q25. TCP/IP model vs OSI
TCP/IP has 4 layers: Application (OSI 5–7), Transport (4), Internet (3), Link (1–2). OSI is a teaching reference; TCP/IP is what the internet uses.

### Q26. TCP vs UDP *(Must-know)*
| | TCP | UDP |
|---|---|---|
| Connection | connection-oriented (handshake) | connectionless |
| Reliability | ordered, retransmits, flow and congestion control | best effort |
| Speed/overhead | higher | lower |
| Use | web, SSH, email, databases | DNS queries, video/voice, gaming, QUIC/HTTP/3, DHCP |

### Q27. TCP three-way handshake *(Must-know)*
1. Client → Server: **SYN** (seq = x)
2. Server → Client: **SYN-ACK** (seq = y, ack = x+1)
3. Client → Server: **ACK** (ack = y+1)
Connection closes with FIN/ACK exchanges (four-way) or RST (abort).

### Q28. What is a port? Common ports
A 16-bit number identifying a service on a host (0–65535). Well-known (<1024) need root to bind.
| Port | Service |
|---|---|
| 20/21 | FTP |
| 22 | SSH |
| 23 | Telnet |
| 25 / 587 / 465 | SMTP / submission / SMTPS |
| 53 | DNS (UDP and TCP) |
| 67/68 | DHCP |
| 80 / 443 | HTTP / HTTPS |
| 110 / 143 | POP3 / IMAP |
| 3306 | MySQL |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 27017 | MongoDB |

### Q29. What is DNS and how does a lookup work? *(Must-know)*
DNS maps names to IPs. Flow: browser cache → OS cache (`/etc/hosts`) → **recursive resolver** (ISP, 8.8.8.8, 1.1.1.1) → root server → TLD server (`.com`) → authoritative server for the domain → answer cached for the **TTL**.
```bash
dig example.com A +short
dig @1.1.1.1 example.com MX
dig +trace example.com
```
Record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (verification/SPF), NS (name servers), SOA, PTR (reverse), SRV, CAA.

### Q30. What is HTTP? Methods and status codes *(Must-know)*
Application protocol for the web (request/response, stateless).
- Methods: `GET` (read), `POST` (create/process), `PUT` (replace), `PATCH` (partial update), `DELETE`, `HEAD`, `OPTIONS`.
- Status classes: `1xx` info, `2xx` success (200 OK, 201 Created, 204 No Content), `3xx` redirect (301 permanent, 302 temporary, 304 not modified), `4xx` client error (400, 401 unauthenticated, 403 forbidden, 404, 429 too many requests), `5xx` server error (500, 502 bad gateway, 503 unavailable, 504 gateway timeout).

### Q31. HTTP vs HTTPS
HTTPS is HTTP over **TLS**: encrypts traffic (confidentiality), authenticates the server via certificates, and protects integrity. Default port 443. Use HTTPS everywhere; add HSTS.

### Q32. What is a MAC address? ARP?
MAC: 48-bit hardware address at layer 2 (`aa:bb:cc:dd:ee:ff`), used inside a local network. **ARP** maps an IPv4 address to a MAC on the same subnet ("who has 192.168.1.1?"). View with `ip neigh`. IPv6 uses NDP instead.

### Q33. What is a router, switch, hub?
Hub: repeats frames to all ports (obsolete). Switch: forwards frames by MAC address within a LAN (layer 2). Router: forwards packets between networks by IP (layer 3). Modern home routers also do NAT, DHCP, Wi-Fi and firewalling.

### Q34. What is DHCP?
Automatically assigns IP address, mask, gateway and DNS to clients. Steps: **DORA** (Discover, Offer, Request, Acknowledge). Uses UDP 67/68.

### Q35. What is NAT?
Network Address Translation rewrites source or destination addresses. **SNAT/masquerade** lets private hosts reach the internet through one public IP; **DNAT/port forwarding** exposes an internal service. A NAT device keeps a table of connections.

### Q36. What is SSH?
Secure Shell: encrypted remote login and tunneling on port 22.
```bash
ssh ritesh@server
ssh -i ~/.ssh/id_ed25519 ritesh@server
ssh-keygen -t ed25519 -C "ritesh@laptop"
ssh-copy-id ritesh@server
scp file ritesh@server:/tmp/ ; rsync -avz dir/ ritesh@server:/data/
```
Use key-based auth; disable password login and root login in `/etc/ssh/sshd_config`.

### Q37. Disk usage commands
```bash
df -h               # filesystem space
df -i               # inode usage
du -sh * | sort -h  # directory sizes
lsblk ; blkid       # block devices, UUIDs
mount | column -t
free -h             # memory
uptime              # load averages
```

### Q38. Archives and compression
```bash
tar -czf backup.tar.gz dir/      # create gzip archive
tar -xzf backup.tar.gz -C /tmp   # extract
tar -tf backup.tar.gz            # list
zip -r a.zip dir ; unzip a.zip
gzip file ; gunzip file.gz ; xz file ; zstd file
```

### Q39. Cron: scheduling jobs
```
# m h dom mon dow command
30 2 * * *  /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1
*/5 * * * * /usr/bin/check.sh
```
Edit with `crontab -e`; list with `crontab -l`. Cron has a minimal environment (set `PATH` and use full paths). Alternative: systemd timers.

### Q40. Basic shell scripting
```bash
#!/usr/bin/env bash
set -euo pipefail          # exit on error, unset vars, pipe failures
name="${1:-Ritesh Kumar}"
if [[ -f /etc/os-release ]]; then
  echo "Hello $name on $(. /etc/os-release; echo "$PRETTY_NAME")"
fi
for f in *.log; do
  [[ -e $f ]] || continue
  echo "$f: $(wc -l < "$f") lines"
done
```
Always quote variables (`"$var"`), check exit codes (`$?`), and use `shellcheck`.

---

# 🔵 Part 2: Junior (1–3 years)

### Q41. Process vs thread
A **process** has its own address space, file descriptors and resources. **Threads** share the process's memory and descriptors but have their own stack and registers. Threads are cheaper to create and switch; a crash in one thread can bring down the process. In Linux both are "tasks" created with `clone()` using different sharing flags.

### Q42. Process states
Running (R), Sleeping interruptible (S), Uninterruptible sleep (D, usually waiting on I/O; cannot be killed), Stopped (T), **Zombie** (Z, finished but parent has not called `wait()`). Check with `ps -o pid,stat,cmd`.

### Q43. Zombie and orphan processes
Zombie: terminated child whose exit status is not yet collected; uses a PID table entry only. Fix by making the parent `wait()`, or kill/restart the parent. Orphan: parent died first; the child is adopted by PID 1 (init/systemd) which reaps it. In containers, use a proper init (`tini`, `--init`) so zombies are reaped.

### Q44. `fork`, `exec`, `wait`
`fork()` duplicates the process (copy-on-write). `exec()` replaces the process image with a new program. `wait()` collects the child's exit status. The shell runs a command by fork + exec. `exit code 0` = success; nonzero = failure.

### Q45. Process priority: nice and renice
Niceness ranges from -20 (highest priority) to 19 (lowest). `nice -n 10 cmd`, `renice 5 -p PID`. Real-time classes (`chrt`) and cgroups give stronger control.

### Q46. Load average
`uptime` shows 1, 5, 15 minute averages of tasks that are **runnable or in uninterruptible I/O wait**. Compare to CPU count: load 4 on a 4-core machine is full utilization; 16 means a queue. High load with low CPU often means I/O wait.

### Q47. Memory: `free`, buffers/cache, swap
```bash
free -h
#               total  used  free  shared  buff/cache  available
```
Linux uses spare RAM as page cache. Look at **available**, not **free**. Swap is disk space used when RAM is short; heavy swapping ("thrashing") kills performance. `vmstat 1`, `/proc/meminfo`, `swappiness` (`vm.swappiness`).

### Q48. OOM killer
When memory and swap are exhausted, the kernel kills a process with a high "badness" score (`/proc/<pid>/oom_score`). Logged in `dmesg`/`journalctl -k` as "Out of memory: Killed process". Mitigate: limits (cgroups), right-size memory, fix leaks, set `oom_score_adj` for critical services.

### Q49. systemd basics *(Must-know)*
systemd is the init system (PID 1) and service manager.
```bash
systemctl status nginx
sudo systemctl start|stop|restart|reload nginx
sudo systemctl enable --now nginx     # start at boot and now
systemctl list-units --type=service --failed
systemctl daemon-reload               # after editing unit files
journalctl -u nginx -f                # follow service logs
```

### Q50. Writing a systemd service
```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My Node App
After=network-online.target
Wants=network-online.target

[Service]
User=app
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=3
Environment=NODE_ENV=production
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```
Then `sudo systemctl daemon-reload && sudo systemctl enable --now myapp`. Hardening options: `NoNewPrivileges=`, `ProtectSystem=`, `PrivateTmp=`.

### Q51. Logs: where and how
Traditional: `/var/log/syslog` (Debian), `/var/log/messages` (RHEL), `/var/log/auth.log` or `secure`, `/var/log/nginx/`. Modern: **journald**.
```bash
journalctl -xe                     # recent errors with context
journalctl -u ssh --since "1 hour ago"
journalctl -p err -b               # errors since this boot
journalctl --disk-usage
dmesg -T | tail                    # kernel ring buffer with timestamps
```
Rotate logs with `logrotate` (`/etc/logrotate.d/`).

### Q52. `find`, `xargs` and safe deletion
```bash
find /tmp -type f -mtime +7 -print0 | xargs -0 rm -f
find . -name "*.js" -not -path "./node_modules/*" -exec grep -l "TODO" {} +
```
Use `-print0 | xargs -0` to handle spaces/newlines in names. Preview with `-print` before `-delete`.

### Q53. `awk`, `sed`, `sort`, `uniq`: log analysis one-liners
```bash
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head   # top client IPs
awk '$9 >= 500' access.log | wc -l                                # count 5xx
awk '{sum+=$10} END {print sum/NR}' access.log                    # average bytes
sed -n '100,120p' file                                            # print lines
cut -d' ' -f7 access.log | sort | uniq -c | sort -nr | head       # top URLs
```

### Q54. Text editors
`vim` basics: `i` insert, `Esc`, `:w` save, `:q` quit, `:wq`, `:q!`, `/text` search, `dd` delete line, `yy` copy, `p` paste, `u` undo. `nano` is simpler. Know at least one editor on servers.

### Q55. File descriptors and `ulimit`
Every open file, socket and pipe uses a descriptor. Limits: `ulimit -n` (per process), `/proc/sys/fs/file-max` (system), systemd `LimitNOFILE`. "Too many open files" means the limit is hit or descriptors leak. Inspect: `ls /proc/<pid>/fd | wc -l`, `lsof -p <pid>`.

### Q56. `lsof`, `ss`, `netstat`
```bash
sudo lsof -i :8080                 # who uses port 8080
ss -tulpn                          # t=tcp u=udp l=listening p=process n=numeric
ss -s                              # socket summary
ss -tan state established | wc -l
```
`netstat` is deprecated in favor of `ss`; `ifconfig` in favor of `ip`.

### Q57. `/etc/hosts`, `/etc/resolv.conf`, `nsswitch.conf`
`/etc/hosts`: static name → IP mapping, checked before DNS (per `/etc/nsswitch.conf`). `/etc/resolv.conf`: DNS servers (often managed by `systemd-resolved`; check with `resolvectl status`). `/etc/hostname`: system name.

### Q58. Routing basics
`ip route` shows the default gateway (`default via 192.168.1.1`) and connected networks. Packets for the local subnet go directly (ARP); everything else goes to the gateway. Add routes: `sudo ip route add 10.10.0.0/16 via 192.168.1.254`. Make persistent through Netplan/NetworkManager/systemd-networkd.

### Q59. Firewall basics: `ufw`, `iptables`, `nftables`, `firewalld`
```bash
sudo ufw allow 22/tcp ; sudo ufw allow 443/tcp ; sudo ufw enable ; sudo ufw status
sudo iptables -L -n -v
sudo nft list ruleset
sudo firewall-cmd --add-service=https --permanent && sudo firewall-cmd --reload
```
Default-deny inbound, allow only needed ports. **Always keep an SSH rule before enabling a firewall remotely.** `nftables` is the modern backend; `iptables` is often a compatibility wrapper.

### Q60. curl and HTTP debugging
```bash
curl -v https://example.com                  # headers and TLS handshake
curl -I https://example.com                  # response headers only
curl -s -o /dev/null -w "%{http_code} %{time_total}\n" https://example.com
curl -X POST -H "Content-Type: application/json" -d '{"name":"Ritesh Kumar"}' https://api.test/users
curl --resolve example.com:443:1.2.3.4 https://example.com   # test a specific IP
curl -k ...                                  # skip cert verification (testing only!)
```

### Q61. HTTP request/response structure
Request: method, path, version, headers (`Host`, `User-Agent`, `Accept`, `Authorization`, `Content-Type`), optional body. Response: status line, headers (`Content-Type`, `Cache-Control`, `Set-Cookie`, `Location`), body.
```
GET /users/1 HTTP/1.1
Host: api.example.com
Accept: application/json
```

### Q62. HTTP versions
- **HTTP/1.1**: persistent connections, text, head-of-line blocking per connection.
- **HTTP/2**: binary, multiplexing many streams over one TCP connection, header compression (HPACK); TCP-level head-of-line blocking remains.
- **HTTP/3**: over QUIC (UDP), per-stream loss recovery, faster handshakes, connection migration.

### Q63. Cookies, sessions, caching headers (network view)
`Set-Cookie` with `HttpOnly`, `Secure`, `SameSite`. Caching: `Cache-Control: max-age=3600, public`, `ETag`/`If-None-Match` (304 responses), `Last-Modified`. `no-store` forbids storing; `no-cache` means revalidate.

### Q64. What is a proxy? Forward vs reverse
Forward proxy: sits in front of clients (corporate filtering, anonymity). Reverse proxy: sits in front of servers (Nginx, HAProxy, Envoy) for TLS termination, load balancing, caching, compression, routing.

### Q65. What is a load balancer?
Distributes traffic across servers for scale and availability. L4 (TCP/UDP, faster, no HTTP awareness) vs L7 (HTTP aware: path/host routing, cookies). Algorithms: round robin, least connections, IP hash, weighted. Needs health checks. Examples: Nginx, HAProxy, AWS ALB/NLB.

### Q66. Basic Nginx reverse proxy config
```nginx
server {
  listen 80;
  server_name example.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
Test with `sudo nginx -t`, reload with `sudo systemctl reload nginx`.

### Q67. TLS/SSL certificates
A certificate binds a public key to a domain, signed by a Certificate Authority (CA). Browsers trust CAs in their store. Let's Encrypt provides free certs (`certbot`, ACME), valid 90 days, auto-renewed. Inspect: `openssl s_client -connect example.com:443 -servername example.com`, `openssl x509 -in cert.pem -noout -dates -subject`.

### Q68. Disk partitions and filesystems
Common filesystems: ext4 (default for many), XFS (RHEL default, great for big files), Btrfs, ZFS (not in mainline kernel), tmpfs (RAM). Basic steps:
```bash
sudo fdisk -l ; lsblk
sudo mkfs.ext4 /dev/sdb1
sudo mount /dev/sdb1 /data
echo 'UUID=<uuid> /data ext4 defaults,nofail 0 2' | sudo tee -a /etc/fstab
sudo mount -a          # test fstab before reboot!
```

### Q69. LVM in brief
Logical Volume Manager: physical volumes (PV) → volume group (VG) → logical volumes (LV). Lets you resize volumes online and span disks. `pvcreate`, `vgcreate`, `lvcreate -L 20G -n data vg0`, `lvextend -r -L +10G /dev/vg0/data` (`-r` also resizes the filesystem).

### Q70. RAID levels (quick)
RAID 0 striping (speed, no redundancy), RAID 1 mirroring, RAID 5 striping with single parity (needs ≥3 disks), RAID 6 double parity, RAID 10 mirrored stripes. RAID is **not a backup**. Software RAID: `mdadm`.

### Q71. Backups and rsync
```bash
rsync -aHAXv --delete /data/ backup@host:/backups/data/
```
Follow 3-2-1: 3 copies, 2 media types, 1 offsite. Test restores. Tools: `restic`, `borg`, snapshots (LVM, ZFS, cloud).

### Q72. Package build vs binary install; PATH and libraries
`ldd /path/binary` lists shared libraries; `ldconfig` updates the cache; `LD_LIBRARY_PATH` adds search paths (use sparingly). "Library not found" errors mean a missing package or wrong path.

### Q73. Time and NTP
Accurate time matters for logs, TLS and distributed systems. `timedatectl`, `chronyc tracking` (chrony), `systemd-timesyncd`. Use UTC on servers.

### Q74. Shell expansions and quoting
Variables: `$var`, `${var:-default}`, command substitution `$(cmd)`, arithmetic `$((a+b))`, globbing `*.txt`, brace expansion `file{1..3}.txt`. Single quotes are literal; double quotes allow `$` expansion. Unquoted variables undergo word splitting: `rm $file` with spaces is dangerous.

### Q75. Exit codes and conditionals
`$?` holds the last exit code. `cmd1 && cmd2` (run second if first succeeded), `cmd1 || cmd2` (on failure), `;` always. `set -e` aborts on error; combine with `trap 'cleanup' EXIT`.

---

# 🟡 Part 3: Mid (3–5 years)

### Q76. TCP in depth: flow control, congestion control, retransmission *(Must-know)*
- **Flow control**: the receiver advertises a **window** (`rwnd`) so the sender does not overflow it.
- **Congestion control**: the sender limits its **congestion window** (`cwnd`) using algorithms like slow start, congestion avoidance, fast retransmit/recovery. Linux defaults to **CUBIC**; **BBR** models bandwidth and RTT and helps on lossy or long links.
- **Reliability**: sequence numbers, ACKs, retransmission timeout (RTO), fast retransmit after 3 duplicate ACKs, SACK.
- Throughput is bounded by `window / RTT` (bandwidth-delay product).

### Q77. TCP connection states and TIME_WAIT
States: LISTEN, SYN_SENT, SYN_RECV, ESTABLISHED, FIN_WAIT_1/2, CLOSE_WAIT, LAST_ACK, TIME_WAIT, CLOSING.
- **TIME_WAIT** (about 60 s on Linux): held by the side that closes first so late packets expire and the final ACK can be resent. Many TIME_WAITs on a client or proxy can exhaust ephemeral ports; fix by connection reuse (keep-alive, pooling), widening `net.ipv4.ip_local_port_range`. `tcp_tw_reuse` can help for outgoing connections; do not use the removed `tcp_tw_recycle`.
- **CLOSE_WAIT** piling up means the **application** did not close its socket after the peer closed: a bug in your code.
```bash
ss -tan | awk 'NR>1{print $1}' | sort | uniq -c
```

### Q78. SYN flood and backlog queues
Attackers send SYNs without finishing handshakes, filling the SYN queue. Defenses: **SYN cookies** (`net.ipv4.tcp_syncookies=1`), larger `tcp_max_syn_backlog`, rate limiting, upstream DDoS protection. The accept queue size is `min(backlog, net.core.somaxconn)`; if the app is slow to `accept()`, connections drop (`ss -lnt` shows Recv-Q/Send-Q for listeners).

### Q79. Keep-alive, timeouts and half-open connections
TCP keepalive probes detect dead peers (defaults are very long: `tcp_keepalive_time=7200s`). HTTP keep-alive reuses connections. A half-open connection happens when one side vanishes without FIN (power loss, NAT timeout). Use application-level heartbeats and timeouts; set sane idle timeouts on load balancers (AWS ALB default 60 s) and keep client timeouts lower than server ones.

### Q80. MTU, fragmentation and MSS
MTU is the largest frame payload on a link (Ethernet 1500). TCP chooses MSS ≈ MTU − 40. **Path MTU Discovery** relies on ICMP "fragmentation needed"; if firewalls block ICMP, large packets silently hang ("black hole"). Symptoms: small requests work, large ones stall (TLS handshake, big POSTs). Fix: allow ICMP type 3 code 4, clamp MSS on VPN/tunnel interfaces.
```bash
ping -M do -s 1472 8.8.8.8    # 1472 + 28 header = 1500
```

### Q81. TLS handshake (1.2 vs 1.3) *(Must-know)*
- **TLS 1.2**: ClientHello → ServerHello + certificate + key exchange → client key exchange → Finished: 2 round trips.
- **TLS 1.3**: 1 round trip (key shares sent in ClientHello), only strong ciphers (AEAD), forward secrecy mandatory, 0-RTT resumption (replay risk).
Concepts: certificate chain (leaf → intermediate → root), SNI (hostname in ClientHello), ALPN (negotiates `h2`, `http/1.1`), OCSP stapling, session resumption.

### Q82. mTLS and certificate management
Mutual TLS: both client and server present certificates (service-to-service auth in service meshes, zero-trust). Manage with an internal CA (cert-manager, Vault PKI, SPIFFE/SPIRE), short lifetimes, automatic rotation, and monitoring expiry. Expired certificates are a top cause of outages.

### Q83. DNS in depth: caching, TTL, propagation, failures
"Propagation" is cache expiry; lower the TTL **before** a migration. Negative caching (NXDOMAIN) also has TTL. Common issues: wrong glue/NS, missing AAAA, CNAME at the zone apex (not allowed; use ALIAS/ANAME), split-horizon DNS, search domains adding delay (`ndots` in Kubernetes), UDP truncation → TCP fallback, DNSSEC validation failures.
```bash
dig +short NS example.com
dig example.com +noall +answer +ttlid
resolvectl query example.com
```

### Q84. HTTP/2 and HTTP/3 behavior you should explain
HTTP/2 multiplexes streams, so fewer connections and no domain sharding; server push is deprecated. HTTP/3/QUIC runs over UDP with built-in TLS 1.3, avoids TCP head-of-line blocking and supports connection migration (switch Wi-Fi to mobile). Firewalls that block UDP/443 force fallback to HTTP/2.

### Q85. CORS, cookies and security headers (network-facing)
CORS is browser enforcement using `Access-Control-Allow-*` headers and preflight `OPTIONS`. Useful headers: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. These do not secure your server by themselves; they limit browser behavior.

### Q86. Reverse proxy tuning (Nginx/HAProxy)
Key settings: worker processes/connections, keep-alive to upstreams (`keepalive` in `upstream`), timeouts (`proxy_read_timeout`), buffering, gzip/brotli, caching (`proxy_cache`), rate limiting (`limit_req`), real client IP (`X-Forwarded-For`, PROXY protocol), WebSocket support (`Upgrade` headers), HTTP/2.
```nginx
upstream app { least_conn; server 10.0.0.11:3000; server 10.0.0.12:3000; keepalive 64; }
location /ws/ { proxy_pass http://app; proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; }
```

### Q87. Load balancing algorithms and health checks
Round robin, weighted RR, least connections, least response time, consistent hashing (cache affinity), IP hash (sticky). Health checks: passive (observe failures) and active (probe `/healthz`). Use **graceful draining** during deploys. Sticky sessions hurt scalability; prefer stateless services with shared session stores.

### Q88. Linux networking internals you should know: namespaces, veth, bridges
Network namespaces give isolated stacks. A **veth pair** is a virtual cable between namespaces. A **bridge** (`docker0`, `br0`) acts like a virtual switch. Containers connect through veth → bridge → NAT (iptables/nftables).
```bash
sudo ip netns add demo
sudo ip link add v0 type veth peer name v1
sudo ip link set v1 netns demo
```

### Q89. iptables/nftables structure
Tables → chains → rules. Tables: `filter`, `nat`, `mangle`, `raw`. Hooks: PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING. Packet path: incoming → PREROUTING (DNAT) → routing decision → INPUT (local) or FORWARD → POSTROUTING (SNAT). Connection tracking (`conntrack`) enables stateful rules (`-m conntrack --ctstate ESTABLISHED,RELATED`).
```bash
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -P INPUT DROP
```
A full `conntrack` table drops new connections ("nf_conntrack: table full").

### Q90. VPN basics: WireGuard, IPsec, OpenVPN
VPNs create encrypted tunnels. **WireGuard**: modern, tiny, fast, kernel module, key-based. **IPsec**: standard for site-to-site (IKEv2). **OpenVPN**: flexible, user-space TLS. Concerns: MTU/MSS, routing (split vs full tunnel), DNS leaks, key rotation.

### Q91. Subnetting and VPC design
Plan CIDRs that do not overlap with other networks (VPN, peering). Split into public/private subnets per availability zone, route tables, NAT gateways for private egress, security groups (stateful, instance-level) vs NACLs (stateless, subnet-level). Keep spare address space.
Example: `10.0.0.0/16` → `/24` per subnet = 256 addresses each (cloud providers reserve some, e.g. 5 in AWS).

### Q92. IPv6 essentials
128-bit, no NAT needed, SLAAC autoconfiguration, NDP replaces ARP, `::1` loopback, `fe80::/10` link-local, `2000::/3` global unicast. Dual-stack is common. Many outages come from missing AAAA/firewall rules for IPv6 or "Happy Eyeballs" fallback delays.

### Q93. Linux performance: the USE method and first 60 seconds
USE: for each resource check **Utilization, Saturation, Errors**. Quick triage:
```bash
uptime ; dmesg -T | tail ; vmstat 1 5 ; mpstat -P ALL 1 3
pidstat 1 3 ; iostat -xz 1 3 ; free -m ; sar -n DEV 1 3 ; sar -n TCP,ETCP 1 3 ; top
```
Read: run queue (`r` in vmstat) vs cores, `wa` (I/O wait), `si/so` (swap), disk `%util` and `await`, network errors/drops.

### Q94. CPU analysis
`top`/`htop` (user `us`, system `sy`, I/O wait `wa`, steal `st` for VMs), `pidstat -u`, `perf top`, `perf record -g` + flame graphs, per-core imbalance (`mpstat`), context switches (`pidstat -w`). High `sy` suggests syscalls or networking; high `st` means a noisy neighbor on the hypervisor.

### Q95. Disk I/O analysis
```bash
iostat -xz 1       # r/s w/s rkB/s wkB/s await %util aqu-sz
iotop -oP          # per-process I/O
```
`await` high + `%util` near 100% = saturated device. Schedulers (`mq-deadline`, `none` for NVMe), filesystem mount options (`noatime`), write-back settings (`vm.dirty_ratio`), and fsync-heavy workloads matter.

### Q96. Memory analysis
`free -m`, `vmstat` (`si/so`), `smem`, `/proc/<pid>/smaps`, `pmap`. Concepts: RSS vs VSZ, shared vs private memory, page cache, slab (`slabtop`), transparent huge pages (can cause latency spikes for databases), NUMA effects, memory leaks (rising RSS), cgroup memory limit (`memory.max`, `memory.events`).

### Q97. Network performance analysis
```bash
ss -ti                 # per-connection RTT, cwnd, retransmits
sar -n DEV 1           # throughput per interface
ip -s link             # errors, drops
nstat -az | grep -i retrans
iperf3 -s ; iperf3 -c server        # throughput test
mtr -rwzc 50 example.com            # path loss and latency
```
Tune only after measuring: socket buffers (`net.core.rmem_max`, `net.ipv4.tcp_rmem`), `somaxconn`, `ip_local_port_range`, congestion control (`net.ipv4.tcp_congestion_control=bbr`), NIC offloads, IRQ affinity, RSS/RPS queues.

### Q98. `strace`, `ltrace`, `lsof`, `perf`
```bash
strace -f -tt -e trace=network,file -p <pid>      # syscalls of a running process
strace -c ./prog                                  # syscall time summary
ltrace ./prog                                      # library calls
perf stat ./prog ; perf record -F 99 -g -p <pid> -- sleep 30 ; perf report
```
`strace` slows the process; for production consider `perf trace` or eBPF tools (`bpftrace`, `bcc`: `execsnoop`, `opensnoop`, `tcplife`).

### Q99. tcpdump and Wireshark
```bash
sudo tcpdump -i eth0 -nn 'tcp port 443 and host 10.0.0.5' -c 100
sudo tcpdump -i any -nn -w cap.pcap port 53
sudo tcpdump -nn -A 'tcp port 80'            # ASCII payload (plaintext HTTP only)
```
Filters use BPF syntax. Look for: SYN with no SYN-ACK (blocked/dropped), RST (refused/aborted), retransmissions, zero-window, slow DNS answers. Open `.pcap` in Wireshark for deep inspection. Capture only what you are authorized to.

### Q100. Troubleshooting "site cannot be reached" step by step *(Must-know)*
1. **Is it local or remote?** Try another site/device.
2. **DNS**: `dig example.com`. Wrong or no answer?
3. **Network reachability**: `ping IP`, `traceroute`/`mtr`.
4. **Port reachable**: `nc -vz host 443` or `curl -v telnet://host:443`.
5. **TLS**: `openssl s_client -connect host:443 -servername host`.
6. **HTTP**: `curl -v` status, headers, redirects.
7. **Server side**: `ss -tlnp` is the app listening? Firewall (`nft list ruleset`), security groups, reverse-proxy logs, app logs, resource limits.
Narrow layer by layer (bottom-up or top-down).

### Q101. `nc` (netcat) and quick tests
```bash
nc -vz host 5432                 # port check
nc -l 9000                       # listen
echo "ping" | nc host 9000       # send data
```
Also `telnet`, `curl telnet://`, `/dev/tcp`: `timeout 3 bash -c '</dev/tcp/host/443' && echo open`.

### Q102. SSH advanced usage
```bash
ssh -L 5432:db.internal:5432 bastion        # local port forward
ssh -R 8080:localhost:3000 server           # remote forward
ssh -D 1080 bastion                         # SOCKS proxy
ssh -J bastion app-server                   # jump host
```
`~/.ssh/config` for aliases (`Host`, `HostName`, `User`, `IdentityFile`, `ProxyJump`). Harden `sshd_config`: `PasswordAuthentication no`, `PermitRootLogin no`, `AllowUsers`, fail2ban, change nothing blindly without a second session open.

### Q103. Users, PAM, sudoers, and least privilege
PAM modules handle authentication (`/etc/pam.d`). Prefer group-based sudo rules in `/etc/sudoers.d/` over blanket `ALL`. Service accounts: `useradd --system --shell /usr/sbin/nologin`. Audit with `last`, `lastb`, `who`, `/var/log/auth.log`, `auditd`.

### Q104. SELinux and AppArmor
Mandatory Access Control layered on top of normal permissions. **SELinux** (RHEL): labels on files/processes; modes enforcing/permissive/disabled; `getenforce`, `setenforce 0` (temporary), `ls -Z`, `restorecon -Rv`, `ausearch -m avc`, `audit2why`. **AppArmor** (Ubuntu/SUSE): path-based profiles, `aa-status`. Do not disable them as a first fix; adjust labels/booleans/profiles.

### Q105. Capabilities
Split root's powers into units (`CAP_NET_BIND_SERVICE`, `CAP_SYS_ADMIN`, `CAP_NET_RAW`). Give a binary only what it needs: `setcap 'cap_net_bind_service=+ep' /usr/bin/node` to bind port 80 without root. Containers drop most capabilities by default.

### Q106. cgroups and resource limits
Control groups limit and account CPU, memory, I/O, pids for process groups. v2 (unified hierarchy) is the default on modern distros. systemd exposes them: `CPUQuota=`, `MemoryMax=`, `TasksMax=`. `systemd-cgtop`. Containers rely on cgroups for limits and namespaces for isolation.

### Q107. Namespaces
Isolate views of system resources: PID, NET, MNT, UTS, IPC, USER, CGROUP (and time). `unshare`, `nsenter -t <pid> -n ip addr`, `lsns`. A container = namespaces + cgroups + a root filesystem + (optionally) seccomp, capabilities and LSM profiles. Containers share the host kernel; VMs run their own.

### Q108. Docker networking and Linux plumbing
Default `bridge` network (`docker0`), user-defined bridges (DNS by container name), `host` (shares host stack), `none`, `overlay` (multi-host). Published ports use DNAT rules (`-p 8080:80`). Debug with `docker inspect`, `docker exec ... ss -tlnp`, `nsenter`, `iptables -t nat -L -n`.

### Q109. Kubernetes networking basics (Linux view)
Every pod gets an IP; pods can reach each other without NAT (CNI plugins: Calico, Cilium, Flannel). Services provide stable virtual IPs via kube-proxy (iptables/IPVS) or eBPF (Cilium). Ingress/Gateway handle L7 routing. CoreDNS resolves `svc.namespace.svc.cluster.local`; `ndots:5` can multiply lookups.

### Q110. Systemd timers and journald tuning
Timers replace cron with dependencies, logging, randomized delay and `Persistent=true` for missed runs.
```ini
# backup.timer
[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true
[Install]
WantedBy=timers.target
```
Limit journal size: `SystemMaxUse=500M` in `/etc/systemd/journald.conf`.

---

# 🟠 Part 4: Senior (5–7 years)

### Q111. Boot process end to end *(Must-know)*
1. Firmware (BIOS/UEFI) runs POST, finds boot device.
2. Bootloader (GRUB2 or systemd-boot) loads kernel + initramfs.
3. Kernel initializes hardware, mounts the initramfs (temporary root with drivers, e.g. for LVM/RAID/encrypted disks).
4. Kernel mounts the real root filesystem, starts PID 1 (`systemd`).
5. systemd brings up targets (`basic.target` → `multi-user.target` → `graphical.target`).
Troubleshoot: GRUB edit (`init=/bin/bash` or `systemd.unit=rescue.target`), `journalctl -b -1` for the previous boot, `systemd-analyze blame`, rebuild initramfs (`update-initramfs -u` / `dracut -f`).

### Q112. Virtual memory, paging and the page cache
Each process has a virtual address space mapped to physical pages via page tables and the TLB. Page faults load pages on demand (minor: in memory, major: from disk). The page cache keeps file data in RAM; dirty pages are written back by flusher threads. `mmap` maps files into memory. Overcommit: `vm.overcommit_memory` controls whether allocations can exceed RAM+swap.

### Q113. Scheduler and CPU topology
CFS (Completely Fair Scheduler; replaced by EEVDF in kernel 6.6+) shares CPU by weight (nice). Real-time policies `SCHED_FIFO/RR`. Tools: `taskset -c 0-3 cmd` (affinity), `numactl --cpunodebind=0 --membind=0`, `chrt`. Isolate cores for latency-critical workloads (`isolcpus`, `nohz_full`), watch NUMA locality and cache sharing.

### Q114. Filesystem internals: journaling, writes and durability
ext4/XFS use a **journal** for metadata consistency after crashes. A `write()` goes to the page cache; durability needs `fsync()`/`fdatasync()`; databases use `O_DIRECT`/`O_DSYNC` and WAL. Barriers/caches on disks matter. Mount options: `noatime`, `discard` vs scheduled `fstrim`. Check filesystem with `fsck` (unmounted!), `xfs_repair`.

### Q115. Linux I/O models: blocking, non-blocking, `select/poll/epoll`, `io_uring`
`select`/`poll` scan all descriptors (O(n)). **`epoll`** registers interest and returns only ready descriptors (scales to 100k+ sockets; edge-triggered vs level-triggered). **`io_uring`** uses shared submission/completion rings to batch syscalls and supports async file I/O. Nginx, Node.js (libuv), Redis, Netty rely on epoll. Know the C10K/C10M problem.

### Q116. Socket programming essentials
Server: `socket → bind → listen → accept → read/write → close`. Client: `socket → connect`. Options: `SO_REUSEADDR`, `SO_REUSEPORT` (multiple listeners share a port), `TCP_NODELAY` (disable Nagle), `SO_KEEPALIVE`, send/receive buffer sizes. Nagle + delayed ACK can add ~40 ms latency for small writes.

### Q117. Kernel network path and tuning
Packet arrives at NIC → DMA to ring buffer → interrupt/NAPI polling → softirq → netfilter hooks → IP → TCP → socket buffer → application `read()`. Features: GRO/GSO/TSO offloads, RSS (multiple RX queues), RPS/RFS, XDP (earliest hook, eBPF). Drops show in `ethtool -S eth0`, `ip -s link`, `/proc/net/softnet_stat`.

### Q118. Sysctl tuning for high-traffic servers
```ini
# /etc/sysctl.d/99-tuning.conf
net.core.somaxconn = 4096
net.core.netdev_max_backlog = 16384
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.ip_local_port_range = 10240 65535
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_syncookies = 1
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
fs.file-max = 2097152
vm.swappiness = 10
```
Apply with `sudo sysctl --system`. Change one thing at a time, benchmark, document why. Defaults are good for most workloads.

### Q119. eBPF and modern observability
eBPF runs sandboxed programs in the kernel for tracing, networking and security without kernel modules. Tools: `bpftrace`, BCC tools, Cilium (networking), Falco/Tetragon (security), Pixie, Parca (profiling). Typical wins: per-connection latency, file open tracing, TCP retransmit tracking with low overhead.

### Q120. Capacity planning and load testing
Baseline normal usage; load test with `wrk`, `k6`, `vegeta`, `locust`, `iperf3`; find the knee in the latency curve; use Little's Law (`L = λ × W`) for concurrency; plan headroom (e.g. 30–40%); monitor saturation signals, not only averages (use p95/p99).

### Q121. Linux hardening checklist
Patch regularly (unattended-upgrades), minimal packages, SSH keys only, firewall default-deny, non-root services, `sudo` auditing, disable unused services, filesystem mounts (`noexec,nosuid,nodev` on `/tmp`), kernel hardening sysctls (`kernel.kptr_restrict`, `net.ipv4.conf.all.rp_filter`), SELinux/AppArmor enforcing, auditd, fail2ban, CIS benchmarks, Lynis scans, centralized logs, file integrity monitoring (AIDE).

### Q122. Incident response on a compromised Linux host (defensive)
Isolate (network quarantine), preserve evidence (memory and disk images when policy requires), review logs (`last`, `auth.log`, shell history, cron, systemd units, `authorized_keys`), check unusual processes/listening ports (`ss -tulpn`, `ps auxf`), compare package hashes (`debsums`, `rpm -V`), rotate credentials, rebuild from known-good images rather than "cleaning". Document timeline. Perform only on systems you are authorized to investigate.

### Q123. Zero-downtime deployment patterns on Linux
Blue/green or rolling behind a load balancer with health checks and connection draining; systemd socket activation or `SO_REUSEPORT` handoff; Nginx `reload` (graceful worker swap); database migrations backward compatible (expand/contract); keep rollback artifacts.

### Q124. DNS and service discovery at scale
Use caching resolvers (`unbound`, `systemd-resolved`, node-local DNS in Kubernetes), reasonable TTLs, health-checked DNS (Route 53, Consul), client-side load balancing, retry with backoff, avoid resolving on every request (HTTP clients should cache), and watch for DNS being the hidden single point of failure.

### Q125. High availability patterns
Keepalived/VRRP for floating IP failover, HAProxy pairs, multi-AZ architectures, anycast, database replication, quorum-based clusters (Raft/Paxos), STONITH/fencing to prevent split-brain, health checks and automatic failover with tested runbooks.

### Q126. Linux containers security
Run as non-root, drop capabilities, read-only root filesystem, seccomp profiles, user namespaces/rootless runtimes (Podman), no `--privileged`, avoid mounting the Docker socket, scan images, pin digests, set resource limits, network policies.

### Q127. Troubleshooting high load with low CPU
Likely I/O wait or D-state tasks: check `vmstat` `wa`, `iostat -x`, `ps -eo stat,pid,wchan:30,cmd | awk '$1 ~ /D/'`, NFS hangs, slow disks, lock contention, swapping. Load counts uninterruptible waits.

### Q128. Troubleshooting memory leaks and OOM
Track RSS over time (`pidstat -r`, Prometheus `process_resident_memory_bytes`), compare heap profiles (language tools), check cgroup events (`memory.events` → `oom_kill`), `dmesg` OOM report (which process, memory map), adjust limits and `oom_score_adj`, add alerts before OOM (e.g. 85%).

### Q129. Troubleshooting intermittent latency
Collect percentile latencies, correlate with CPU steal, GC pauses, disk stalls, retransmissions (`nstat`, `ss -ti`), DNS time (`curl -w %{time_namelookup}`), conntrack saturation, noisy neighbors, THP compaction, timer/keepalive resets. Use traces and packet captures from both ends.

### Q130. Log management at scale
Ship logs with agents (Fluent Bit, Vector, Promtail, Filebeat) to a central store (Loki, Elasticsearch, CloudWatch); structured JSON logs; correlation IDs; retention policies and sampling; protect sensitive data; alert on patterns (error rate, auth failures). Local `logrotate` keeps disks safe.

### Q131. Shell scripting best practices (production)
```bash
#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'
trap 'echo "failed at line $LINENO" >&2' ERR
readonly LOCK=/var/lock/job.lock
exec 9>"$LOCK"; flock -n 9 || { echo "already running"; exit 1; }   # prevent overlap
```
Use functions, `mktemp`, quotes, `[[ ]]`, avoid parsing `ls`, validate inputs, log with timestamps, run `shellcheck` in CI. For complex logic switch to Python or Go.

### Q132. Configuration management and IaC for Linux
Ansible (agentless, YAML playbooks, idempotent), Terraform (provision), cloud-init (first boot), Packer (images), Chef/Puppet/Salt. Principles: idempotence, version control, immutable images when possible, drift detection, secrets in a vault.

### Q133. Package and release management
Pin versions, use internal mirrors/repositories (Nexus, Artifactory, aptly), verify signatures (GPG), build `.deb/.rpm` with `fpm` or native tools, track CVEs (`apt list --upgradable`, `dnf updateinfo`, Trivy, OpenSCAP), plan kernel updates (livepatch, kpatch) and reboots.

### Q134. Monitoring Linux hosts
Metrics: node_exporter (CPU, memory, disk, network, filesystem), process-level cAdvisor/ps; logs; traces. Alert on symptoms (latency, errors, saturation) and on resource exhaustion trends (disk full in 4 hours, inode exhaustion, memory pressure via PSI `/proc/pressure/*`). Golden signals: latency, traffic, errors, saturation.

### Q135. Disk full emergencies
```bash
df -h ; df -i
sudo du -xh / --max-depth=1 2>/dev/null | sort -h | tail
sudo lsof +L1                    # deleted files still held open by processes
journalctl --vacuum-size=200M
```
A deleted-but-open file keeps space until the process restarts or truncates it (`: > /proc/<pid>/fd/<n>` only as a last resort). Clean package caches, old logs, container layers (`docker system df`).

### Q136. Kernel modules, parameters and DKMS
`lsmod`, `modinfo`, `modprobe`, `rmmod`, `/etc/modprobe.d/` for options and blacklists. DKMS rebuilds out-of-tree modules (NVIDIA, ZFS) on kernel updates. Secure Boot may block unsigned modules.

### Q137. Time-related pitfalls
Clock skew breaks TLS, Kerberos, TOTP and distributed locks. Use chrony, monitor offset, use monotonic clocks for durations (`CLOCK_MONOTONIC`), handle leap seconds/time smearing, store UTC. VM pauses can cause sudden jumps.

### Q138. Debugging a process that will not die
Check state: `D` state waits for I/O (kill won't work until I/O returns: investigate NFS/storage). `Z` zombie: kill the parent. Otherwise, `kill -TERM`, then `-KILL`; check for `SIGKILL` blocked by being a kernel thread, or use `systemctl kill`, `cgroup.kill` (cgroup v2).

### Q139. Understand `/proc` and `/sys`
`/proc/<pid>/{cmdline,environ,status,fd,maps,limits,cwd,exe}`, `/proc/meminfo`, `/proc/cpuinfo`, `/proc/loadavg`, `/proc/net/*`, `/proc/sys/*` (tunables), `/proc/pressure/*` (PSI). `/sys/class/net/eth0/`, `/sys/block/`, `/sys/fs/cgroup/`. Many tools just read these files; you can too.

### Q140. Common anti-patterns in Linux operations
Running as root everywhere, `chmod 777`, editing production by hand without version control, no backups tested, `kill -9` as the first step, disabling the firewall/SELinux to "fix" things, ignoring disk/inode alerts, snowflake servers, cron jobs without locking or logging, secrets in shell history or scripts.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q141. How do you design a secure, scalable Linux-based platform?
Immutable images (Packer) + IaC (Terraform/Ansible), autoscaling groups behind load balancers across zones, private subnets with bastion/SSM access instead of public SSH, centralized auth (SSO, short-lived SSH certificates), centralized logging/metrics, automatic patching windows, least privilege and network segmentation, backups with tested restores, and documented runbooks.

### Q142. How do you decide between VMs, containers and bare metal?
VMs: strong isolation, different kernels/OS, legacy apps. Containers: density, fast deploys, same kernel, good for stateless services. Bare metal: lowest latency, special hardware (GPUs, NICs), predictable performance, licensing. Consider security boundary, operational maturity, cost, and noisy neighbors. MicroVMs (Firecracker, Kata) combine fast boot and strong isolation.

### Q143. Network architecture for a multi-tier application
Edge: CDN + WAF + DDoS protection → public load balancer (TLS termination) → app tier in private subnets → data tier in isolated subnets (no internet route) → egress via NAT/proxy with allow-lists. Use security groups per tier, private endpoints for cloud services, separate management network, flow logs, and consistent DNS (split-horizon).

### Q144. Zero-trust and service-to-service security
Authenticate and authorize every call (mTLS, JWT/SPIFFE identities), least privilege network policies, no implicit trust from network location, short-lived credentials, encrypted traffic everywhere, continuous verification, audit trails.

### Q145. Multi-region and DR strategy
Define RTO/RPO per service. Patterns: backup/restore, pilot light, warm standby, active-active. Use DNS failover or global load balancing (anycast), replicate data (async vs sync trade-offs), test failovers (game days), keep infra reproducible from code.

### Q146. Capacity and cost management
Right-size instances, use autoscaling and spot/preemptible capacity for tolerant workloads, reserved/committed discounts for baseline, review egress costs (cross-AZ/region traffic), compress and cache, set budgets and alerts, tag resources.

### Q147. SRE practices: SLOs, error budgets, on-call
Define SLIs (latency, availability), SLOs (target), error budgets that gate risky releases, blameless postmortems, runbooks, actionable alerts only, toil reduction through automation, capacity reviews.

### Q148. Platform standardization
Golden images and base AMIs, hardened baselines (CIS), standard logging/metrics agents, templates for services (systemd units, Dockerfiles, Helm charts), policy-as-code (OPA/Conftest, Kyverno), and an internal developer platform to reduce variance.

### Q149. Migration planning (on-prem to cloud, or OS upgrades)
Inventory dependencies (network flows, ports, data stores), choose strategy (rehost, replatform, refactor), establish connectivity (VPN/Direct Connect), migrate in waves, run in parallel with traffic shifting (weighted DNS), validate with synthetic checks, keep rollback plans, communicate cutover windows.

### Q150. Leading a major outage investigation
Stabilize first (rollback, failover, rate limit), then communicate (status page, incident channel, roles: commander, comms, ops), collect timeline and evidence (graphs, logs, packet captures), find root causes using "5 whys" including process gaps, produce actions with owners and due dates, track to completion.

### Q151. Mentoring juniors on troubleshooting
Teach a method: define the symptom, form hypotheses, test one change at a time, check each layer, read logs before guessing, keep notes. Provide a personal "toolbox" cheat sheet and practice with game days or broken-lab exercises.

### Q152. Evaluating networking technologies
Service mesh (Istio, Linkerd) for mTLS/traffic policy/telemetry vs complexity and overhead; eBPF-based CNI (Cilium) for performance and observability; API gateways; HTTP/3 adoption; IPv6 migration; SD-WAN. Decide with a measurable problem statement and a pilot.

### Q153. Standardizing access and auditing
SSH certificates from a CA (short-lived), SSO + MFA for bastions or session managers (AWS SSM, Teleport), session recording, `sudo` logging, central identity (LDAP/SSSD/OIDC), break-glass accounts, periodic access reviews.

### Q154. Compliance considerations
Map controls (SOC 2, ISO 27001, PCI DSS, HIPAA) to technical measures: encryption at rest and in transit, access logs, change management via IaC and PRs, vulnerability management SLAs, backup and retention policies, evidence automation.

### Q155. Interview approach to unknown Linux/network problems
State your method aloud: "I'll check the layer model from the bottom: link, IP, DNS, port, TLS, application; and for the host the USE method." Naming a systematic approach impresses more than guessing commands.

---

# 💻 Part 6: Hands-On Tasks & Scripts

### H1. Find the top 10 largest files under `/var`
```bash
sudo find /var -type f -printf '%s %p\n' 2>/dev/null | sort -nr | head -10
# or: sudo du -ah /var 2>/dev/null | sort -rh | head -10
```

### H2. Find which process uses a port, then stop it gracefully
```bash
sudo ss -tlnp | grep ':8080'
sudo lsof -i :8080
kill -TERM <pid>; sleep 5; kill -0 <pid> 2>/dev/null && kill -KILL <pid>
```

### H3. Count HTTP status codes in an Nginx log
```bash
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -nr
```

### H4. Top 5 slowest URLs (if the log ends with request time)
```bash
awk '{print $NF, $7}' access.log | sort -nr | head -5
```

### H5. Monitor a file for new errors in real time
```bash
tail -F /var/log/app.log | grep --line-buffered -E "ERROR|FATAL"
```

### H6. Backup script with rotation
```bash
#!/usr/bin/env bash
set -euo pipefail
SRC=/var/www ; DEST=/backups ; KEEP=7
ts=$(date +%F_%H%M)
mkdir -p "$DEST"
tar -czf "$DEST/site_$ts.tar.gz" -C "$SRC" .
find "$DEST" -name 'site_*.tar.gz' -mtime +"$KEEP" -delete
echo "Backup done: $DEST/site_$ts.tar.gz"
```

### H7. Health-check script with exit codes (usable by cron or monitoring)
```bash
#!/usr/bin/env bash
url=${1:?usage: $0 URL}
code=$(curl -s -o /dev/null -m 5 -w '%{http_code}' "$url" || true)
if [[ "$code" == 200 ]]; then echo "OK $url"; exit 0
else echo "FAIL $url ($code)" >&2; exit 2; fi
```

### H8. Check which ports are open on a remote host (your own host or with permission)
```bash
nc -zv host 20-1024 2>&1 | grep succeeded
# or: nmap -p 1-1024 host   (scan only systems you are authorized to test)
```

### H9. Create a user with SSH key access only
```bash
sudo useradd -m -s /bin/bash ritesh
sudo mkdir -p /home/ritesh/.ssh
echo "ssh-ed25519 AAAA... ritesh@laptop" | sudo tee /home/ritesh/.ssh/authorized_keys
sudo chown -R ritesh:ritesh /home/ritesh/.ssh
sudo chmod 700 /home/ritesh/.ssh ; sudo chmod 600 /home/ritesh/.ssh/authorized_keys
sudo passwd -l ritesh        # lock password login
```

### H10. Set up Nginx with HTTPS using Certbot (Ubuntu)
```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
sudo certbot renew --dry-run
```

### H11. Open only SSH and HTTPS with UFW
```bash
sudo ufw default deny incoming ; sudo ufw default allow outgoing
sudo ufw allow OpenSSH ; sudo ufw allow 443/tcp
sudo ufw enable ; sudo ufw status verbose
```

### H12. Run a Node app as a service and see logs
Use the unit from Q50, then:
```bash
sudo systemctl enable --now myapp
journalctl -u myapp -f
```

### H13. Add swap file (emergency memory relief)
```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### H14. Extend an LVM volume and filesystem online
```bash
sudo lvextend -r -L +10G /dev/vg0/data
df -h /data
```

### H15. Measure DNS and connection timing
```bash
curl -s -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\n' https://example.com
```

### H16. Subnet calculation quickly
`10.0.5.0/22` → mask `255.255.252.0`, block size 4 in the third octet, range `10.0.4.0` to `10.0.7.255`, 1022 usable hosts. Tools: `ipcalc`, `sipcalc`, or Python:
```python
import ipaddress
n = ipaddress.ip_network("10.0.5.0/22", strict=False)
print(n, n.netmask, n.num_addresses, n.network_address, n.broadcast_address)
```

### H17. Detect and kill zombies' parents safely
```bash
ps -eo pid,ppid,stat,cmd | awk '$3 ~ /^Z/'
# find parent PID (ppid), investigate, restart that service:
sudo systemctl restart <service>
```

### H18. Reverse proxy with WebSocket support and rate limit (Nginx)
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
server {
  listen 443 ssl http2;
  server_name api.example.com;
  location /api/ { limit_req zone=api burst=20 nodelay; proxy_pass http://127.0.0.1:3000; }
  location /ws/  { proxy_pass http://127.0.0.1:3000; proxy_http_version 1.1;
                   proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; }
}
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. "Permission denied" when running a script
Check execute bit (`ls -l`), filesystem mounted `noexec` (`mount | grep noexec`), shebang path/CRLF line endings (`file script.sh`, fix with `dos2unix`), SELinux (`ausearch -m avc`), and directory traversal permissions on every parent directory (`namei -l /path/to/file`).

### D2. `command not found`
Not installed, not in `PATH`, wrong shell environment (cron has a tiny PATH), typo, or a script with wrong shebang. Use `type cmd`, `echo $PATH`, full path, `hash -r`.

### D3. Disk shows full but `du` shows less
Deleted files still held open: `sudo lsof +L1`. Or inodes exhausted: `df -i`. Or space reserved for root (ext4 5% reserved, `tune2fs -m`), or hidden mounts covering data.

### D4. Service starts manually but fails under systemd
Different environment, user, working directory, PATH or permissions. Check `systemctl status`, `journalctl -u svc -b`, add `Environment=`, `WorkingDirectory=`, `User=`. Use absolute paths in `ExecStart`. Test with `systemd-run` or `sudo -u appuser ...`.

### D5. Port already in use (`EADDRINUSE`)
`ss -tlnp | grep :PORT`; old process still running or TIME_WAIT (use `SO_REUSEADDR`); two instances configured with the same port; container port clash.

### D6. SSH "Permission denied (publickey)"
Wrong key/user, permissions (`~/.ssh` 700, `authorized_keys` 600, home dir not group-writable), `sshd_config` `AllowUsers`/`PubkeyAuthentication`, SELinux contexts on `.ssh`. Debug with `ssh -vvv` and server logs `journalctl -u ssh`.

### D7. Can ping IP but cannot open website by name
DNS problem. Check `/etc/resolv.conf`, `resolvectl status`, `dig @8.8.8.8 example.com`, firewall blocking UDP/TCP 53, or a broken VPN DNS.

### D8. Can resolve DNS but HTTPS hangs
MTU/PMTUD black hole, firewall on 443, TLS inspection, IPv6 route broken (try `curl -4` vs `curl -6`), server overloaded. Compare `curl -v` output and `tcpdump`.

### D9. Intermittent 502/504 from Nginx
Upstream crashed/restarting, timeout too low, upstream keep-alive mismatch (backend closes idle connections before the proxy does), file descriptor limits, backlog overflow. Check Nginx `error.log`, upstream logs, `ss -lnt` Recv-Q, align idle timeouts (proxy shorter than backend).

### D10. "Too many open files"
Raise `LimitNOFILE` for the service (not just shell `ulimit`), find leaks (`ls /proc/PID/fd | wc -l`, `lsof -p`), close connections properly, tune `fs.file-max`.

### D11. High CPU `sy` (system time)
Many syscalls or context switches: tiny reads/writes, busy polling, lock contention, network interrupts, conntrack. Use `perf top`, `strace -c`, `pidstat -w`, check `softirq` (`mpstat -I SUM`).

### D12. Container cannot reach the internet
Check IP forwarding (`sysctl net.ipv4.ip_forward`), MASQUERADE rule, DNS in the container (`/etc/resolv.conf`), corporate proxy, firewall (ufw/firewalld interfering with Docker's chains), MTU on overlay/VPN.

### D13. Clock drift causes TLS or auth failures
`timedatectl`, `chronyc tracking`; fix NTP reachability (UDP 123), VM time sync settings. Never "fix" by disabling certificate checks.

### D14. Cron job does not run
Check `crontab -l`, cron daemon running, syntax, `%` characters need escaping, PATH/env, output redirection, permissions on `/etc/cron.d` files (root-owned, no group write), and logs (`grep CRON /var/log/syslog` or `journalctl -u cron`).

### D15. Server unreachable after enabling the firewall
Missed SSH rule. Use console/out-of-band access to fix. Prevention: schedule a rollback (`sudo sh -c 'sleep 300; ufw disable' &`), test rules in a second session before logging out.

---

# 🧩 Part 8: Tricky Questions

### T1. Why does `kill -9` sometimes not kill a process?
The process is in uninterruptible sleep (D state, e.g. hung NFS or storage), or it is a zombie (already dead), or it is a kernel thread. SIGKILL is delivered when the task returns to a state that can handle signals.

### T2. Does deleting a file free disk space immediately?
Only if no process has it open and no other hard link exists. Otherwise the space is freed when the last reference is closed.

### T3. What is the difference between `>` and `>>` and `2>&1` order?
`>` truncates, `>>` appends. `cmd > f 2>&1` sends both to the file; `cmd 2>&1 > f` sends stderr to the **original** stdout (terminal) and only stdout to the file, because redirections are processed left to right.

### T4. `rm -rf $DIR/*` risk
If `$DIR` is empty or unset it becomes `rm -rf /*`. Use `"${DIR:?}"`, `set -u`, and never run with unvalidated variables. (Modern GNU `rm` protects `/` itself, but not `/*`.)

### T5. Why is `ping` working but `curl` failing?
ICMP is not TCP/HTTP. Firewalls can allow ICMP and block ports, or the service is down. Conversely ping can fail (ICMP blocked) while HTTP works. Test at the right layer.

### T6. Is a port "open" if it is listening?
Listening only means a process called `listen()`. Reachability also depends on the bind address (`127.0.0.1` vs `0.0.0.0`), host firewall, security groups, NAT and routing. Check from outside.

### T7. What does `0.0.0.0` mean?
As a bind address: all IPv4 interfaces. As a route: default route (`0.0.0.0/0`). As a source: "this host" before it has an address (DHCP). It is not a valid destination for normal traffic.

### T8. Why does a UDP service need extra care?
No connection state, no retransmission, easy to spoof (amplification attacks), packets may be dropped/reordered/duplicated, fragmentation issues. Application must handle loss and validate sources (QUIC adds encryption and connection IDs).

### T9. What is the difference between a proxy and NAT?
A proxy terminates the connection and opens a new one on behalf of the client (application-level, can inspect and modify). NAT rewrites addresses/ports in packets while keeping the same end-to-end connection semantics at lower layers.

### T10. Why do load averages include I/O waits on Linux?
Linux counts tasks in D state as "runnable" for load, unlike some Unix systems. It reflects system demand, not just CPU.

### T11. Can two processes listen on the same port?
Normally no (`EADDRINUSE`), unless `SO_REUSEPORT` is set (kernel load balances connections), or they bind different IPs/protocols. Sharing a listening socket via fork or systemd socket activation is also common.

### T12. Why can a /24 not hold 256 hosts?
Two addresses are reserved (network and broadcast), leaving 254. (Cloud providers reserve a few more.) /31 point-to-point links (RFC 3021) and /32 host routes are special cases.

### T13. What happens when you type a URL and press Enter? *(Must-know)*
1. Browser parses URL, checks cache and HSTS.
2. DNS resolution (browser → OS → resolver → authoritative).
3. TCP handshake to IP:443 (or QUIC for HTTP/3).
4. TLS handshake (certificate validation, key exchange, ALPN).
5. HTTP request sent (headers, cookies).
6. Possibly CDN/load balancer/reverse proxy → application → database/cache.
7. Response returns (status, headers, body); compression, caching rules.
8. Browser parses HTML, fetches CSS/JS/images (more requests, HTTP/2 multiplexing), builds DOM/CSSOM, renders.
Mention where each can fail and be optimized (DNS TTL, keep-alive, CDN, caching).

### T14. Hard link counts on directories
A directory's link count is 2 + number of subdirectories (its own entry, its `.` entry, and each child's `..`). That is why `ls -ld` on an empty directory shows 2.

### T15. Why is `swap` used even with free RAM?
The kernel may move rarely used anonymous pages to swap to make more room for page cache (`swappiness`). Some swap use is normal; sustained swap-in/out (`si/so`) is the problem.

### T16. Is `chmod -R 777` ever correct?
Almost never. It removes protection, enables privilege escalation and breaks SSH key rules. Find the real owner/group problem and fix it.

### T17. What is the difference between `reload` and `restart`?
`reload` asks the daemon to re-read configuration without dropping connections (if supported, via SIGHUP or a reload command). `restart` stops and starts the service, causing downtime and lost connections.

### T18. What is a "bastion host"?
A hardened, monitored server exposed to the internet that acts as the single gateway (SSH jump host) into private networks. Modern alternatives: SSM Session Manager, Teleport, identity-aware proxies.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Everything is a …?** File.
- **Kernel vs distribution?** Core vs complete OS.
- **PID 1?** init / systemd.
- **List files with hidden?** `ls -a`.
- **Permissions 755 means?** `rwxr-xr-x`.
- **Change owner?** `chown`.
- **Find text in files?** `grep -rn`.
- **Find files by name?** `find` / `locate`.
- **Live logs?** `tail -f`, `journalctl -f`.
- **Disk space / inode space?** `df -h` / `df -i`.
- **Memory usage?** `free -h`.
- **Listening ports?** `ss -tulpn`.
- **Replace ifconfig?** `ip addr`.
- **Replace netstat?** `ss`.
- **Process list?** `ps aux`, `top`.
- **Graceful stop signal?** SIGTERM (15).
- **Unblockable kill?** SIGKILL (9).
- **Service manager?** `systemctl`.
- **Schedule jobs?** cron / systemd timers.
- **Remote shell?** SSH (22).
- **Transfer files?** `scp`, `rsync`.
- **DNS query tool?** `dig`.
- **HTTP test tool?** `curl`.
- **Packet capture?** `tcpdump`, Wireshark.
- **Path tracing?** `traceroute`, `mtr`.
- **HTTP default ports?** 80 / 443.
- **DNS port?** 53 (UDP/TCP).
- **TCP handshake?** SYN, SYN-ACK, ACK.
- **Layer 3 device?** Router. **Layer 2?** Switch.
- **OSI layers count?** 7.
- **Private IP ranges?** 10/8, 172.16/12, 192.168/16.
- **IPv6 length?** 128 bits.
- **TLS purpose?** Encrypt, authenticate, protect integrity.
- **Firewall default policy?** Deny inbound.
- **NAT purpose?** Share addresses / hide private IPs.
- **Container isolation tech?** Namespaces + cgroups.
- **Mandatory access control?** SELinux / AppArmor.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a production outage you debugged on Linux.
STAR example: "API latency spiked every 10 minutes. I used `vmstat` and `iostat` and saw I/O wait spikes matching a log-rotation job that compressed huge files on the same disk. I moved compression to low priority (`nice`/`ionice`), rotated more often, and shipped logs off-host. P99 latency returned to normal and I added disk-latency alerts."

### P2. How did you secure a server you managed?
Describe baseline: SSH keys only, firewall default-deny, unattended security updates, non-root services with systemd hardening, fail2ban, centralized logs, backups with tested restores, and a CIS/Lynis scan with remediation tracking.

### P3. Describe a networking issue that was hard to diagnose.
Example: large uploads hung through a VPN. Packet capture showed retransmissions after full-size packets; ICMP was blocked so PMTUD failed. Fixed by clamping MSS on the tunnel and allowing ICMP type 3 code 4. Lesson: capture both ends and think about MTU.

### P4. How do you automate repetitive Linux tasks?
Scripts with `set -euo pipefail`, Ansible roles for configuration, systemd timers instead of ad-hoc cron, CI pipelines for image builds, and documentation. Always make automation idempotent and observable.

### P5. How do you keep systems patched without downtime?
Staging first, rolling updates behind load balancers with draining, canary hosts, automated tests, kernel livepatch where possible, maintenance windows for reboots, and rollback images.

### P6. How do you learn and stay current?
Man pages first, Brendan Gregg's performance material, LWN.net, distribution release notes, lab VMs/containers for experiments, postmortems from other companies, and certifications (RHCSA, LFCS) if useful.

### P7. How do you handle being on call?
Clear runbooks, actionable alerts, a standard triage flow, escalation paths, communication updates, postmortems with follow-ups, and automation to reduce repeat incidents.

---

# 📚 Part 11: Complete Coverage (Linux + Networking + Mixed)

## Linux
- **Basics:** history, distributions, kernel vs OS, shells, filesystem hierarchy, paths, help system (`man`, `--help`, `info`, `tldr`).
- **Files:** permissions, ownership, ACLs (`getfacl/setfacl`), special bits, links, inodes, attributes (`chattr +i`), find/locate, archives.
- **Text processing:** grep, sed, awk, cut, sort, uniq, tr, xargs, tee, diff, jq (JSON).
- **Processes:** states, signals, priorities, job control, daemons, zombies, `/proc`, cgroups, namespaces.
- **Memory/CPU/IO:** virtual memory, swap, page cache, OOM, scheduler, NUMA, I/O schedulers, `vmstat`, `iostat`, `perf`.
- **Storage:** partitions, filesystems, fstab, LVM, RAID, mounts, quotas, encryption (LUKS), SMART.
- **Users/security:** users, groups, sudo, PAM, SSH hardening, SELinux/AppArmor, capabilities, auditd, firewalls, fail2ban.
- **Services/boot:** GRUB, initramfs, systemd units/targets/timers, journald, logrotate, cron.
- **Packaging:** apt/dpkg, dnf/rpm, snap/flatpak, building packages, repositories.
- **Shell scripting:** variables, conditionals, loops, functions, traps, arrays, getopts, portability (POSIX vs bash), shellcheck.
- **Virtualization/containers:** KVM/QEMU, libvirt, Docker/Podman, LXC, systemd-nspawn.

## Networking
- **Models:** OSI, TCP/IP, encapsulation (frame → packet → segment → data).
- **L2:** Ethernet, MAC, ARP, VLANs (802.1Q), STP, switches, bonding/LACP.
- **L3:** IPv4/IPv6, subnetting/CIDR, routing, NAT, ICMP, VPN tunnels, BGP/OSPF (awareness).
- **L4:** TCP (handshake, windows, congestion), UDP, ports, sockets, QUIC.
- **L7:** DNS, HTTP/1.1/2/3, TLS, SMTP/IMAP, FTP/SFTP, SSH, WebSocket, gRPC, MQTT.
- **Infra:** proxies, load balancers, CDNs, firewalls, WAF, API gateways, service mesh, DNS providers.
- **Troubleshooting:** ping, traceroute/mtr, dig, curl, ss, tcpdump, nmap (authorized only), openssl, iperf3.
- **Security:** TLS, mTLS, DDoS, spoofing, MITM, ARP poisoning, DNS attacks, zero trust, segmentation.

## Mixed topics
- Linux + cloud: EC2/VM images, cloud-init, security groups, IAM roles, metadata service (IMDSv2), EBS/LVM, autoscaling.
- Linux + DevOps: CI runners, Ansible, Terraform, Docker, Kubernetes nodes, systemd in containers, observability agents.
- Linux + backend: ulimits, ports, reverse proxies, process managers (systemd/PM2), graceful shutdown (SIGTERM), health checks, TLS termination.
- Linux + databases: filesystem choice, THP off, `vm.swappiness`, `fsync`, I/O scheduler, huge pages, NUMA, backups with snapshots.
- Linux + security: hardening, patching, audit trails, key management, container isolation.

---

# 🔬 Part 12: Kernel and Stack Internals

### I1. System call path
User code calls a libc wrapper → `syscall` instruction switches to kernel mode (ring 0) → kernel validates arguments → performs work → returns to user mode. Expensive relative to function calls (mitigations like KPTI add cost). `vDSO` provides fast time calls without a full syscall.

### I2. Virtual File System (VFS)
A common interface (`open`, `read`, `write`) over many filesystems (ext4, XFS, NFS, procfs, tmpfs). Key objects: superblock, inode, dentry (directory entry cache), file. The dentry cache speeds path lookups.

### I3. Page cache and writeback
Reads fill the page cache; writes mark pages dirty and flusher threads write them based on `vm.dirty_background_ratio`, `vm.dirty_ratio`, and age. `fsync` forces durability. `drop_caches` is only for testing (it is not a "fix").

### I4. Process creation: copy-on-write
`fork` shares pages marked read-only; a write triggers a page fault and copy. That makes fork + exec cheap. `vfork`/`posix_spawn` avoid copying page tables entirely.

### I5. Memory management: buddy allocator, slab, OOM
Physical pages via the buddy allocator; small kernel objects via slab/slub caches. Zones (DMA, Normal), watermarks, `kswapd` reclaims in the background, direct reclaim stalls allocators, compaction defragments memory, OOM killer is the last resort.

### I6. Network stack objects
`sk_buff` (packet), `sock` (socket), `net_device`. Receive path: NIC → ring buffer → NAPI poll → `netif_receive_skb` → netfilter → `ip_rcv` → `tcp_v4_rcv` → socket receive queue → `recv()`. Transmit path is the reverse with qdisc (traffic control) and the NIC driver.

### I7. Connection tracking and NAT
`nf_conntrack` stores per-flow state (`conntrack -L`). NAT uses it to translate replies consistently. Large tables, short timeouts or UDP floods can exhaust it. Tune `nf_conntrack_max`, bypass with `NOTRACK` for heavy stateless traffic, or use eBPF datapaths.

### I8. Traffic control (tc) and queueing
Qdiscs (`fq_codel` default on many systems, `fq`, `htb`, `tbf`) shape and schedule packets, fight bufferbloat, and implement rate limits. `tc qdisc show`, `tc -s qdisc`. Netem simulates latency/loss for testing: `tc qdisc add dev eth0 root netem delay 100ms loss 1%`.

### I9. TCP internals: buffers and autotuning
Socket buffers autotune within `tcp_rmem`/`tcp_wmem` (min, default, max). Receive window scaling lets windows exceed 64 KB. Delayed ACK, Nagle, SACK, timestamps, ECN, TCP Fast Open, pacing (`fq`) and BBR all affect latency/throughput.

### I10. Namespaces and cgroups under containers
`clone(CLONE_NEWPID | CLONE_NEWNET | ...)` creates isolated views. Cgroup controllers (cpu, memory, io, pids) enforce limits via files in `/sys/fs/cgroup`. OverlayFS stacks read-only image layers with a writable layer. seccomp-bpf filters syscalls.

### I11. DNS resolution on Linux
Applications call `getaddrinfo()` → glibc follows `/etc/nsswitch.conf` (`files dns`) → `/etc/hosts`, then resolver from `/etc/resolv.conf` (often a stub at `127.0.0.53` from systemd-resolved). musl (Alpine) resolver behaves differently (no search-domain sequential retries in older versions; ndots details), a known source of container DNS surprises.

### I12. TLS stack in practice
Libraries: OpenSSL, BoringSSL, GnuTLS. Certificate verification uses the system trust store (`/etc/ssl/certs`, `update-ca-certificates`). Session tickets/resumption reduce handshakes; OCSP/CRL check revocation; ciphers prefer AES-GCM/ChaCha20-Poly1305 with ECDHE.

---

# 📊 Part 13: Reference Tables

### Permission quick reference
| Octal | Symbolic | Typical use |
|---|---|---|
| 755 | rwxr-xr-x | programs, directories |
| 644 | rw-r--r-- | regular files |
| 600 | rw------- | private keys, secrets |
| 700 | rwx------ | private directories (`~/.ssh`) |
| 775 | rwxrwxr-x | shared group directories |
| 4755 | rwsr-xr-x | setuid binaries |
| 1777 | rwxrwxrwt | `/tmp` |

### Useful commands by task
| Task | Command |
|---|---|
| CPU/memory live | `top`, `htop` |
| Disk I/O | `iostat -xz 1`, `iotop` |
| Network sockets | `ss -tulpn` |
| Network throughput | `sar -n DEV 1`, `iftop`, `nload` |
| Open files | `lsof -p PID` |
| Syscalls | `strace -p PID` |
| Packets | `tcpdump -i any -nn` |
| DNS | `dig`, `resolvectl` |
| TLS | `openssl s_client` |
| Kernel messages | `dmesg -T`, `journalctl -k` |
| Service logs | `journalctl -u name` |

### CIDR cheat sheet
| CIDR | Mask | Addresses | Usable hosts |
|---|---|---|---|
| /32 | 255.255.255.255 | 1 | 1 (host) |
| /30 | 255.255.255.252 | 4 | 2 |
| /29 | 255.255.255.248 | 8 | 6 |
| /28 | 255.255.255.240 | 16 | 14 |
| /27 | 255.255.255.224 | 32 | 30 |
| /26 | 255.255.255.192 | 64 | 62 |
| /25 | 255.255.255.128 | 128 | 126 |
| /24 | 255.255.255.0 | 256 | 254 |
| /23 | 255.255.254.0 | 512 | 510 |
| /22 | 255.255.252.0 | 1,024 | 1,022 |
| /16 | 255.255.0.0 | 65,536 | 65,534 |
| /8 | 255.0.0.0 | 16,777,216 | 16,777,214 |

### Protocol and port summary
| Protocol | Transport | Port |
|---|---|---|
| HTTP / HTTPS | TCP (QUIC: UDP) | 80 / 443 |
| SSH / SFTP | TCP | 22 |
| DNS | UDP, TCP | 53 |
| DHCP | UDP | 67, 68 |
| NTP | UDP | 123 |
| SMTP / IMAPS / POP3S | TCP | 25,587 / 993 / 995 |
| LDAP / LDAPS | TCP | 389 / 636 |
| SNMP | UDP | 161 |
| Syslog | UDP/TCP | 514 |
| RDP | TCP | 3389 |

### HTTP status code cheat sheet
| Code | Meaning | Debug hint |
|---|---|---|
| 301/302 | Redirect | check `Location` |
| 400 | Bad request | malformed input |
| 401 | Unauthenticated | missing/invalid credentials |
| 403 | Forbidden | permission, WAF, IP block |
| 404 | Not found | wrong path/routing |
| 429 | Too many requests | rate limit |
| 500 | Server error | app logs |
| 502 | Bad gateway | upstream crashed/invalid response |
| 503 | Unavailable | overloaded/maintenance |
| 504 | Gateway timeout | upstream too slow |

### TCP states cheat sheet
| State | Meaning |
|---|---|
| LISTEN | server waiting |
| SYN_SENT / SYN_RECV | handshake in progress |
| ESTABLISHED | open connection |
| FIN_WAIT / CLOSE_WAIT | closing; CLOSE_WAIT = local app has not closed |
| TIME_WAIT | waiting for stray packets after close |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```bash
echo "a b   c" | wc -w
```
**Output:** `3`. Words are separated by whitespace.

### O2.
```bash
x="Ritesh Kumar"
echo ${#x} ${x:0:6} ${x^^}
```
**Output:** `12 Ritesh RITESH KUMAR`. Length, substring, uppercase (bash 4+).

### O3.
```bash
ls /nonexistent 2>/dev/null; echo $?
```
**Output:** `2` (GNU `ls` returns 2 for a serious error). Nothing is printed for the error because stderr is discarded.

### O4.
```bash
true && echo A || echo B
false && echo A || echo B
```
**Output:** `A` then `B`.

### O5.
```bash
cmd > out.txt 2>&1   # vs
cmd 2>&1 > out.txt
```
**Answer:** First: both stdout and stderr go to `out.txt`. Second: stderr goes to the terminal, stdout goes to the file.

### O6.
```bash
a=5; b=3
echo $((a * b)) $((a % b)) $((a ** 2))
```
**Output:** `15 2 25`.

### O7. Subnet question
**Q:** How many usable hosts are in `192.168.10.0/26`?
**A:** `/26` has 64 addresses, minus network and broadcast = **62**.

### O8. Which subnet does `172.16.45.130/25` belong to?
`/25` has a block size of 128 in the last octet: `172.16.45.128/25`, range `.128` to `.255`, broadcast `172.16.45.255`.

### O9. Permission math
`chmod 640 f` then `ls -l f`. **Output:** `-rw-r-----`. Owner read/write, group read, others nothing.

### O10. umask
`umask 027`, then `touch f; mkdir d`. **Result:** file `640` (`666 & ~027`), directory `750` (`777 & ~027`).

### O11.
```bash
for i in {1..3}; do echo -n "$i "; done; echo
```
**Output:** `1 2 3 ` followed by a newline.

### O12. Pipe exit status
```bash
false | true; echo $?
set -o pipefail; false | true; echo $?
```
**Output:** `0` then `1`. Without `pipefail`, the pipeline status is the last command's.

---

# ✅ Part 15: MCQs

**1. Which command shows listening TCP/UDP sockets with processes?**
A) `ls -l`  B) `ss -tulpn`  C) `ps -e`  D) `df -h`
**Answer: B**

**2. Permission `755` on a file means:**
A) rw-r--r--  B) rwxr-xr-x  C) rwx------  D) rwxrwxrwx
**Answer: B**

**3. Which signal cannot be caught or ignored?**
A) SIGTERM  B) SIGINT  C) SIGKILL  D) SIGHUP
**Answer: C**

**4. TCP uses which sequence to open a connection?**
A) SYN, ACK, FIN  B) SYN, SYN-ACK, ACK  C) ACK, SYN, FIN  D) RST, SYN, ACK
**Answer: B**

**5. Which OSI layer do routers operate on?**
A) 1  B) 2  C) 3  D) 4
**Answer: C**

**6. What is PID 1 on modern Linux?**
A) bash  B) systemd (init)  C) kernel  D) cron
**Answer: B**

**7. A zombie process is:**
A) running at high CPU  B) terminated but not yet reaped by its parent  C) blocked on disk  D) a stopped job
**Answer: B**

**8. Which file stores password hashes?**
A) `/etc/passwd`  B) `/etc/shadow`  C) `/etc/group`  D) `/etc/hosts`
**Answer: B**

**9. Which command shows inode usage?**
A) `df -i`  B) `du -i`  C) `free -i`  D) `ls -i`
**Answer: A**

**10. Which DNS record maps a name to an IPv6 address?**
A) A  B) AAAA  C) CNAME  D) MX
**Answer: B**

**11. HTTP 502 usually means:**
A) client error  B) bad response from upstream/gateway  C) not found  D) success
**Answer: B**

**12. Which statement about hard links is true?**
A) They can cross filesystems  B) They share the same inode  C) They break if the target is deleted  D) They can link directories
**Answer: B**

**13. Which tool captures packets on the CLI?**
A) `curl`  B) `tcpdump`  C) `dig`  D) `top`
**Answer: B**

**14. CIDR `/24` provides how many usable host addresses (classic IPv4 LAN)?**
A) 256  B) 255  C) 254  D) 252
**Answer: C**

**15. Which service manager command enables a service at boot and starts it now?**
A) `systemctl start --boot`  B) `systemctl enable --now svc`  C) `service svc on`  D) `systemctl load svc`
**Answer: B**

**16. Which port is used by HTTPS?**
A) 80  B) 8080  C) 443  D) 22
**Answer: C**

**17. High `wa` in `top` indicates:**
A) CPU waiting on I/O  B) Wi-Fi activity  C) Waiting for user input only  D) Memory leak
**Answer: A**

**18. What is the main purpose of ARP?**
A) Resolve names to IPs  B) Resolve IPs to MACs on a LAN  C) Assign IPs  D) Encrypt traffic
**Answer: B**

**19. Which is stateless: security group or NACL (AWS)?**
A) Security group  B) NACL  C) both  D) neither
**Answer: B** (security groups are stateful)

**20. Containers isolate processes primarily using:**
A) Hypervisors  B) Namespaces and cgroups  C) Separate kernels  D) BIOS
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Using `chmod 777`** instead of fixing ownership.
2. **Running everything as root.**
3. **Editing production configs without backups or version control.**
4. **Enabling a firewall remotely without an SSH rule** (lock yourself out).
5. **`kill -9` first.** Try SIGTERM; SIGKILL skips cleanup.
6. **Ignoring inode and disk-full alerts until outage.**
7. **Looking at `free` instead of `available` memory.**
8. **Unquoted variables in shell scripts**, causing word splitting and globbing bugs.
9. **No `set -euo pipefail`** and no error handling in scripts.
10. **Forgetting `-a` in `usermod -G`**, which removes existing groups.
11. **Not testing `/etc/fstab`** with `mount -a` before reboot (can fail boot).
12. **Disabling SELinux/AppArmor instead of fixing contexts/profiles.**
13. **Assuming DNS changes are instant** (TTL/caches).
14. **Blaming "the network" without layer-by-layer evidence.**
15. **Blocking all ICMP**, which breaks Path MTU Discovery.
16. **Using plain `http://` or `-k` in production tooling.**
17. **Leaving default ports and passwords on exposed services.**
18. **No log rotation**, filling disks.
19. **Backups never restore-tested.**
20. **Tuning sysctls from random blog posts** without measuring.
21. **Running long jobs without `nohup`/tmux/systemd** and losing them on disconnect.
22. **Cron jobs without locking, logging, or absolute paths.**

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You troubleshoot with a **method** (layers for networks, USE for hosts) and say what each command proves or rules out.
- You can explain what happens from typing a URL to rendering, including DNS, TCP, TLS and HTTP/2, and where latency hides.
- You read `ss`, `iostat`, `vmstat`, `dmesg` and `journalctl` output fluently and link symptoms to causes (CLOSE_WAIT = app bug, high `wa` = disk, high `st` = noisy neighbor).
- You know the practical meaning of cgroups, namespaces, capabilities, SELinux and why containers are not VMs.
- You write safe, idempotent scripts (`set -euo pipefail`, locking, traps, quotes) and know when to switch languages.
- You treat patching, backups, hardening and observability as part of the design, not afterthoughts.
- You tune only after measuring and can name the trade-off of each knob.
- You explain failure modes: MTU black holes, conntrack exhaustion, ephemeral port exhaustion, TIME_WAIT, DNS TTL, expired certificates.
- You design for failure: health checks, graceful drain, timeouts shorter than upstream, retries with backoff, tested restores.
- You communicate clearly during incidents and write blameless postmortems.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Linux survival commands
```bash
ls -lah ; cd ; pwd ; cp ; mv ; rm -r ; mkdir -p ; find ; grep -rn
chmod ; chown ; sudo ; ps aux ; top ; kill ; df -h ; du -sh ; free -h
systemctl status|start|stop|restart|enable ; journalctl -u svc -f
ss -tulpn ; ip addr ; ip route ; ping ; dig ; curl -v ; tcpdump
tar -czf / -xzf ; rsync -avz ; ssh ; scp
```

### Troubleshooting flow (network)
`Link/IP (ip addr, ping gateway) → Routing (ip route, traceroute) → DNS (dig) → Port (nc -vz) → TLS (openssl s_client) → HTTP (curl -v) → Server (ss, logs, firewall)`

### Troubleshooting flow (host)
`uptime → dmesg → vmstat → mpstat → pidstat → iostat → free → sar -n → top`, then drill into the guilty resource using the USE method.

### TCP/IP numbers worth memorizing
Ports: 22 SSH, 53 DNS, 80/443 HTTP(S), 25/587 SMTP, 3306 MySQL, 5432 PostgreSQL, 6379 Redis. Ethernet MTU 1500. Private ranges 10/8, 172.16/12, 192.168/16. Handshake = 3 packets, close = 4.

### Interview strategy
1. Start with the concept in one sentence.
2. Give the command and what its output means.
3. Mention a real failure you have seen.
4. Mention the security or reliability implication.
5. If unsure, say how you would verify (`man`, a lab VM, official docs).

### Final checklist before the interview
- [ ] Explain permissions, special bits, umask and links with examples.
- [ ] Explain process states, signals, zombies and systemd service management.
- [ ] Read `top`, `vmstat`, `iostat`, `ss`, `free` outputs aloud.
- [ ] Explain TCP handshake, TIME_WAIT/CLOSE_WAIT, TLS handshake, DNS lookup, HTTP/2 vs HTTP/3.
- [ ] Subnet a /22 and /26 quickly and explain NAT, routing and firewalls.
- [ ] Narrate the "URL to page" flow and a layered troubleshooting method.
- [ ] Prepare two incident stories with symptom, evidence, fix and prevention.

