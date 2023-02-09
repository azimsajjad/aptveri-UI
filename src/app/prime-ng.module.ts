import { NgModule } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpeedDialModule } from 'primeng/speeddial';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

const PrimeNgComponet = [
    AutoCompleteModule,
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
    CardModule,
    CalendarModule,
    ChartModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ContextMenuModule,
    DataViewModule,
    DialogModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    PaginatorModule,
    InputSwitchModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    ScrollPanelModule,
    ScrollTopModule,
    TabViewModule,
    TagModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    VirtualScrollerModule,
    StyleClassModule,
    SpeedDialModule,
    DynamicDialogModule,
];

@NgModule({
    imports: [PrimeNgComponet],
    exports: [PrimeNgComponet],
})
export class PrimeNgModule {}
