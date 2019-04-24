/********************************************************************************
 * Copyright (C) 2019 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';
import { MimeService } from '@theia/core/lib/browser/mime-service';
import { PreferenceChange, PreferenceService } from '@theia/core/lib/browser/preferences/preference-service';
import { MaybePromise } from '@theia/core/lib/common/types';
import { inject, injectable } from 'inversify';
import { FileSystemConfiguration } from './filesystem-preferences';

@injectable()
export class MimeUpdater implements FrontendApplicationContribution {
    @inject(PreferenceService)
    protected readonly preferenceService: PreferenceService;
    @inject(MimeService)
    protected readonly mimeService: MimeService;

    onStart?(app: FrontendApplication): MaybePromise<void> {
        this.preferenceService.onPreferenceChanged((e: PreferenceChange) => {
            if (e.affects('files.associations')) {
                const fileAssociations = this.preferenceService.get('files.associations') as FileSystemConfiguration['files.associations'];
                this.setAssociations(fileAssociations);
            }
        });
    }

    private setAssociations(fileAssociations: { [filepattern: string]: string }) {
        const mimeAssociations = Object.keys(fileAssociations).map((filepattern: string) => ({ id: fileAssociations[filepattern], filepattern }));
        this.mimeService.setAssociations(mimeAssociations);
    }
}
