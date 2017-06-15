# -*- coding: utf-8 -*-

import psutil


class MemPercent(object):

    """Get the Mem percent."""

    def __init__(self):
        self.stats = {}

    def get(self):

        # Update stats using the standard system lib
        # Grab MEM using the PSUtil virtual_memory method
        vm_stats = psutil.virtual_memory()

        # Get all the memory stats (copy/paste of the PsUtil documentation)
        # total: total physical memory available.
        # available: the actual amount of available memory that can be given instantly to processes that request more memory in bytes; this is calculated by summing different memory values depending on the platform (e.g. free + buffers + cached on Linux) and it is supposed to be used to monitor actual memory usage in a cross platform fashion.
        # percent: the percentage usage calculated as (total - available) / total * 100.
        # used: memory used, calculated differently depending on the platform and designed for informational purposes only.
        # free: memory not being used at all (zeroed) that is readily available; note that this doesn’t reflect the actual memory available (use ‘available’ instead).
        # Platform-specific fields:
        # active: (UNIX): memory currently in use or very recently used, and so it is in RAM.
        # inactive: (UNIX): memory that is marked as not used.
        # buffers: (Linux, BSD): cache for things like file system metadata.
        # cached: (Linux, BSD): cache for various things.
        # wired: (BSD, macOS): memory that is marked to always stay in RAM. It is never moved to disk.
        # shared: (BSD): memory that may be simultaneously accessed by multiple processes.
        for mem in ['total', 'available', 'percent', 'used', 'free',
                    'active', 'inactive', 'buffers', 'cached',
                    'wired', 'shared']:
            if hasattr(vm_stats, mem):
                self.stats[mem] = getattr(vm_stats, mem)

        # Use the 'free'/htop calculation
        # free=available+buffer+cached
        self.stats['free'] = self.stats['available']
        if hasattr(self.stats, 'buffers'):
            self.stats['free'] += self.stats['buffers']
        if hasattr(self.stats, 'cached'):
            self.stats['free'] += self.stats['cached']
        # used=total-free
        self.stats['used'] = self.stats['total'] - self.stats['free']

        return self.stats
